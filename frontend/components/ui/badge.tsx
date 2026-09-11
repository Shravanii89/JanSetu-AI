// JanSetu AI - Badge (UI Primitive)
import React from "react";

export interface BadgeProps {
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-badge ${className}`}>
      {children || <span>Badge Component Placeholder</span>}
    </div>
  );
};

export default Badge;
