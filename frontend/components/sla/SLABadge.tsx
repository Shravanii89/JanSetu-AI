// JanSetu AI - SLABadge (SLA Tracking)
import React from "react";

export interface SLABadgeProps {
  className?: string;
  children?: React.ReactNode;
}

export const SLABadge: React.FC<SLABadgeProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-slabadge ${className}`}>
      {children || <span>SLABadge Component Placeholder</span>}
    </div>
  );
};

export default SLABadge;
