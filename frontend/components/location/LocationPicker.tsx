"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation, Loader2, AlertCircle, Info, X } from "lucide-react";
import { useTranslation } from "../../context/LanguageContext";

// Dynamically import LocationMap with SSR disabled to prevent window/document errors
const LocationMap = dynamic(() => import("./LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 sm:h-72 md:h-80 rounded-xl border border-[#E9E9E9] bg-[#F5F7FA] flex flex-col items-center justify-center gap-2 text-[#667085] animate-pulse">
      <Loader2 className="h-6 w-6 animate-spin text-[#1F5E91]" />
      <span className="text-xs font-semibold">Loading interactive map...</span>
    </div>
  ),
});

export interface LocationPickerProps {
  value: string;
  latitude?: number;
  longitude?: number;
  onChange: (address: string, lat?: number, lng?: number) => void;
  className?: string;
  required?: boolean;
}

// Clean address formatter for OpenStreetMap Nominatim response
function formatNominatimAddress(data: any): string {
  if (!data) return "";
  if (data.address) {
    const addr = data.address;
    const parts: string[] = [];

    // 1. Specific landmark / amenity / building
    const poi = addr.amenity || addr.building || addr.shop || addr.tourism || addr.office || addr.leisure;
    if (poi) parts.push(poi);

    // 2. Road / Street
    const road = addr.road || addr.pedestrian || addr.street || addr.footway || addr.path;
    if (road) parts.push(road);

    // 3. Suburb / Area / Locality in Pune
    const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || addr.quarter;
    if (suburb && !parts.includes(suburb)) parts.push(suburb);

    // 4. City / Town
    const city = addr.city || addr.town || addr.municipality || "Pune";
    if (city && !parts.includes(city)) parts.push(city);

    // 5. Postal code
    if (addr.postcode) parts.push(addr.postcode);

    if (parts.length > 0) {
      return parts.join(", ");
    }
  }

  return data.display_name || "";
}

export default function LocationPicker({
  value,
  latitude,
  longitude,
  onChange,
  className = "",
  required = true,
}: LocationPickerProps) {
  const { t } = useTranslation();
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [flyToTrigger, setFlyToTrigger] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [targetZoom, setTargetZoom] = useState(15);

  // Reverse geocode latitude and longitude to human-readable address
  const reverseGeocode = useCallback(
    async (lat: number, lng: number): Promise<string> => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              "Accept": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Geocoding service unavailable");
        }
        const data = await response.json();
        const formatted = formatNominatimAddress(data);
        return formatted || `Pune Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      } catch (err) {
        console.warn("Reverse geocode fallback:", err);
        return `Pune Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      }
    },
    []
  );

  // Handler for browser Geolocation API
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError(
        t("reportPage.locationUnavailable") ||
          "Geolocation is not supported by your browser. Please type your location or pick it on the map."
      );
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setTargetZoom(16);
        setFlyToTrigger(Date.now());

        try {
          const address = await reverseGeocode(lat, lng);
          onChange(address, lat, lng);
        } catch (err) {
          onChange(value || `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`, lat, lng);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError(
              t("reportPage.locationPermissionDenied") ||
                "Location access was denied. Please select your location directly on the map or type it manually."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError(
              t("reportPage.locationUnavailable") ||
                "Location information is unavailable. Please select your location on the map or type it manually."
            );
            break;
          case error.TIMEOUT:
            setGeoError(
              t("reportPage.locationTimeout") ||
                "Location request timed out. Please select on the map or try again."
            );
            break;
          default:
            setGeoError(
              t("reportPage.locationUnavailable") ||
                "Could not retrieve location. Please select on the map or type manually."
            );
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, [navigator, reverseGeocode, onChange, value, t]);

  // Handler for map clicks
  const handleMapLocationSelect = useCallback(
    async (lat: number, lng: number) => {
      setGeoError(null);
      setTargetZoom(15);
      const address = await reverseGeocode(lat, lng);
      onChange(address, lat, lng);
    },
    [reverseGeocode, onChange]
  );

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-[#1F5E91]" />
          <span>{t("reportPage.locationLabel") || "AREA / LANDMARK / LOCATION IN PUNE"}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
        {latitude && longitude && (
          <span className="text-[10px] font-mono text-[#667085] bg-[#F5F4F0] px-2 py-0.5 rounded border border-[#E9E9E9]">
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </span>
        )}
      </div>

      {/* Input container with map pin icon and tooltip */}
      <div className="relative">
        <input
          type="text"
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value, latitude, longitude)}
          placeholder={
            t("reportPage.locationPlaceholder") ||
            "e.g. Baner Road near Balewadi Phata, or Kothrud near Karve Statue"
          }
          className="w-full rounded-xl border border-[#E9E9E9] pl-4 pr-12 py-3 text-xs sm:text-sm text-[#1F2933] placeholder-[#667085] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] bg-white transition"
        />

        {/* Map pin / current location button inside the input on the right side */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label={t("reportPage.useCurrentLocation") || "Use my current location"}
            className="relative p-2 rounded-lg text-[#1F5E91] hover:text-[#123B5D] hover:bg-[#F5F4F0] transition-colors focus:outline-none disabled:opacity-50"
          >
            {isLocating ? (
              <Loader2 className="h-5 w-5 animate-spin text-[#F39A32]" />
            ) : (
              <Navigation className="h-5 w-5 fill-[#1F5E91]/10 text-[#1F5E91] hover:text-[#123B5D] transition-transform active:scale-90" />
            )}

            {/* Tooltip on hover */}
            {showTooltip && (
              <div
                role="tooltip"
                className="absolute right-0 bottom-full mb-2.5 z-30 whitespace-nowrap rounded-lg bg-[#123B5D] px-2.5 py-1.5 text-[11px] font-bold text-white shadow-lg border border-[#1F5E91]/40 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
              >
                <span>{t("reportPage.useCurrentLocation") || "Use my current location"}</span>
                {/* Arrow */}
                <span className="absolute right-3 top-full border-4 border-transparent border-t-[#123B5D]"></span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Geolocation Error Alert (Clean & non-breaking) */}
      {geoError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex items-start justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{geoError}</span>
          </div>
          <button
            type="button"
            onClick={() => setGeoError(null)}
            className="text-amber-700 hover:text-amber-900 p-0.5 rounded"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Interactive Leaflet Map */}
      <LocationMap
        latitude={latitude}
        longitude={longitude}
        address={value}
        onLocationSelect={handleMapLocationSelect}
        flyToTrigger={flyToTrigger}
        targetZoom={targetZoom}
      />

      {/* Tip box below the map */}
      <div className="flex items-start gap-2 rounded-xl border border-[#1F5E91]/20 bg-[#1F5E91]/5 p-3 text-xs text-[#123B5D]">
        <Info className="h-4 w-4 text-[#F39A32] shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          {t("reportPage.mapTip") ||
            "Tip: You can also click on the map to select a location. The address will be filled automatically."}
        </span>
      </div>
    </div>
  );
}
