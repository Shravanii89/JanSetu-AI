// JanSetu AI - TrackingPreview (Landing Page)
import React from "react";

export interface TrackingPreviewProps {
  className?: string;
  children?: React.ReactNode;
}

export const TrackingPreview: React.FC<TrackingPreviewProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-trackingpreview ${className}`}>
      {children || <span>TrackingPreview Component Placeholder</span>}
    </div>
  );
};

export default TrackingPreview;
