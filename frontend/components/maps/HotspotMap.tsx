// JanSetu AI - HotspotMap (Mapping)
import React from "react";

export interface HotspotMapProps {
  className?: string;
  children?: React.ReactNode;
}

export const HotspotMap: React.FC<HotspotMapProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-hotspotmap ${className}`}>
      {children || <span>HotspotMap Component Placeholder</span>}
    </div>
  );
};

export default HotspotMap;
