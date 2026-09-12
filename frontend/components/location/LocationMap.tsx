"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const DEFAULT_PUNE_COORDS: [number, number] = [18.5204, 73.8567];
export const DEFAULT_ZOOM = 12;

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
  flyToTrigger?: number; // timestamp to trigger flyTo
  targetZoom?: number;
  readOnly?: boolean;
  markerTitle?: string;
  heightClassName?: string;
}

// Controller component to handle programmatic map movements and size invalidation
function MapController({
  coords,
  zoom,
  flyToTrigger,
}: {
  coords: [number, number];
  zoom: number;
  flyToTrigger?: number;
}) {
  const map = useMap();
  const prevCoordsRef = useRef<[number, number] | null>(null);
  const prevTriggerRef = useRef<number | undefined>(undefined);

  // Invalidate size once map mounts and after a brief delay to ensure no gray tiles
  useEffect(() => {
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  // Smoothly fly to target when coordinates or flyToTrigger change
  useEffect(() => {
    if (!map) return;

    const [lat, lng] = coords;
    const isDefaultPune =
      Math.abs(lat - DEFAULT_PUNE_COORDS[0]) < 0.0001 &&
      Math.abs(lng - DEFAULT_PUNE_COORDS[1]) < 0.0001;

    const coordsChanged =
      !prevCoordsRef.current ||
      Math.abs(prevCoordsRef.current[0] - lat) > 0.00001 ||
      Math.abs(prevCoordsRef.current[1] - lng) > 0.00001;

    const triggerFired = flyToTrigger && flyToTrigger !== prevTriggerRef.current;

    if (triggerFired || (coordsChanged && !isDefaultPune)) {
      prevCoordsRef.current = [lat, lng];
      if (flyToTrigger) {
        prevTriggerRef.current = flyToTrigger;
      }

      // Invalidate size so container bounding rect is accurate before animating
      map.invalidateSize({ animate: false });

      // Use street-level zoom (16-17) for detected locations, default zoom for Pune center
      const targetZoomLevel = isDefaultPune ? (zoom || DEFAULT_ZOOM) : Math.max(zoom || 16, 16);

      try {
        map.flyTo([lat, lng], targetZoomLevel, {
          animate: true,
          duration: 1.2,
          easeLinearity: 0.25,
        });
      } catch {
        // Fallback to direct setView if flyTo animation fails
        map.setView([lat, lng], targetZoomLevel);
      }
    } else if (!prevCoordsRef.current) {
      prevCoordsRef.current = [lat, lng];
    }
  }, [coords, zoom, flyToTrigger, map]);

  return null;
}

// Map click listener component
function MapEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: any) {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
}

export default function LocationMap({
  latitude,
  longitude,
  address,
  onLocationSelect,
  flyToTrigger,
  targetZoom = 15,
  readOnly = false,
  markerTitle,
  heightClassName,
}: LocationMapProps) {
  const currentCoords: [number, number] = useMemo(() => {
    if (typeof latitude === "number" && typeof longitude === "number") {
      return [latitude, longitude];
    }
    return DEFAULT_PUNE_COORDS;
  }, [latitude, longitude]);

  const hasSelectedPosition = typeof latitude === "number" && typeof longitude === "number";

  // Create custom SVG marker icon matching JanSetu AI brand colors (#1F5E91 & #F39A32)
  const pinIcon = useMemo(() => {
    return L.divIcon({
      className: "jansetu-custom-map-pin",
      html: `
        <div style="position: relative; width: 34px; height: 44px; display: flex; justify-content: center; align-items: center; cursor: pointer;">
          <svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));">
            <path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 44 17 44C17 44 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="#1F5E91"/>
            <circle cx="17" cy="17" r="8" fill="#F39A32"/>
            <circle cx="17" cy="17" r="4" fill="#FFFFFF"/>
          </svg>
        </div>
      `,
      iconSize: [34, 44],
      iconAnchor: [17, 44],
      popupAnchor: [0, -42],
    });
  }, []);

  return (
    <div className={`w-full ${heightClassName || "h-64 sm:h-72 md:h-80"} rounded-xl overflow-hidden border border-[#E9E9E9] relative z-0 shadow-inner bg-[#EBF0F5]`}>
      <MapContainer
        center={currentCoords}
        zoom={hasSelectedPosition ? targetZoom : DEFAULT_ZOOM}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        dragging={true}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapController
          coords={currentCoords}
          zoom={targetZoom}
          flyToTrigger={flyToTrigger}
        />

        {onLocationSelect && !readOnly && <MapEvents onMapClick={onLocationSelect} />}

        {/* Marker is always shown either at selected position or default Pune position */}
        <Marker
          position={currentCoords}
          icon={pinIcon}
          draggable={!readOnly && !!onLocationSelect}
          eventHandlers={{
            click: (e: any) => {
              e.target.openPopup();
            },
            dragend: (e: any) => {
              if (onLocationSelect) {
                const marker = e.target;
                const pos = marker.getLatLng();
                onLocationSelect(pos.lat, pos.lng);
              }
            },
          }}
        >
          <Popup className="jansetu-leaflet-popup">
            <div className="p-1 min-w-[200px] max-w-[260px] text-xs font-sans">
              <div className="flex items-center gap-1.5 font-black text-[#123B5D] border-b border-[#E9E9E9] pb-1.5 mb-1.5">
                <span className="h-2 w-2 rounded-full bg-[#F39A32] inline-block"></span>
                <span>{markerTitle || (hasSelectedPosition ? "Complaint Location" : "Pune (Default Center)")}</span>
              </div>
              {address ? (
                <p className="text-[#1F2933] font-medium leading-tight mb-2">
                  {address}
                </p>
              ) : (
                <p className="text-[#667085] italic mb-2">
                  {readOnly ? "Location specified for this complaint." : "Click anywhere on the map to choose a specific location."}
                </p>
              )}
              <div className="bg-[#F5F4F0] p-1.5 rounded text-[11px] text-[#667085] font-mono flex items-center justify-between border border-[#E9E9E9]">
                <span>Lat: {currentCoords[0].toFixed(4)}</span>
                <span>Lng: {currentCoords[1].toFixed(4)}</span>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
