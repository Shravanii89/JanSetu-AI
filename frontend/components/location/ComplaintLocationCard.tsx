"use client";

import React from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation, Loader2, Compass } from "lucide-react";

// Dynamically import LocationMap with SSR disabled
const LocationMap = dynamic(() => import("./LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 sm:h-56 rounded-xl border border-[#E9E9E9] bg-[#F5F7FA] flex flex-col items-center justify-center gap-2 text-[#667085] animate-pulse">
      <Loader2 className="h-5 w-5 animate-spin text-[#1F5E91]" />
      <span className="text-xs font-semibold">Loading map view...</span>
    </div>
  ),
});

export interface ComplaintLocationCardProps {
  locationName?: string;
  latitude?: number | null;
  longitude?: number | null;
  ward?: string | null;
  trackingNumber?: string;
  className?: string;
}

export default function ComplaintLocationCard({
  locationName,
  latitude,
  longitude,
  ward,
  trackingNumber,
  className = "",
}: ComplaintLocationCardProps) {
  const hasCoordinates = typeof latitude === "number" && typeof longitude === "number";

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1F5E91]/10 text-[#1F5E91]">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Complaint Location
            </h4>
            {ward && <span className="text-[10px] text-slate-500 font-medium">{ward}</span>}
          </div>
        </div>

        {/* Coordinates badge */}
        {hasCoordinates ? (
          <div className="flex items-center gap-1.5 bg-[#123B5D] text-white px-2.5 py-1 rounded-lg text-[11px] font-mono shadow-sm">
            <Compass className="h-3.5 w-3.5 text-[#F39A32]" />
            <span>
              {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
            </span>
          </div>
        ) : (
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
            Approximate Location
          </span>
        )}
      </div>

      {/* Location Name / Address */}
      <div className="flex items-start gap-2 text-xs">
        <Navigation className="h-3.5 w-3.5 text-[#1F5E91] shrink-0 mt-0.5" />
        <span className="font-semibold text-slate-800 leading-snug">
          {locationName || "Area in Pune, Maharashtra"}
        </span>
      </div>

      {/* Embedded Read-only Interactive Leaflet Map */}
      <div className="mt-2">
        <LocationMap
          latitude={hasCoordinates ? (latitude as number) : undefined}
          longitude={hasCoordinates ? (longitude as number) : undefined}
          address={locationName || (trackingNumber ? `Grievance ${trackingNumber}` : "Complaint Location")}
          readOnly={true}
          markerTitle={trackingNumber ? `Grievance: ${trackingNumber}` : "Complaint Location"}
          targetZoom={hasCoordinates ? 16 : 12}
          heightClassName="h-48 sm:h-56"
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>
          {hasCoordinates
            ? "Exact GPS coordinates recorded upon submission"
            : "Location specified by citizen address"}
        </span>
        {hasCoordinates && (
          <span className="font-mono text-[10px] text-slate-400">
            Pune Municipal Ward Mapping
          </span>
        )}
      </div>
    </div>
  );
}
