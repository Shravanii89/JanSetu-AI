// JanSetu AI - MapLegend (Mapping)
import React from "react";

export interface MapLegendProps {
  className?: string;
  children?: React.ReactNode;
}

export const MapLegend: React.FC<MapLegendProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-maplegend ${className}`}>
      {children || <span>MapLegend Component Placeholder</span>}
    </div>
  );
};

export default MapLegend;
