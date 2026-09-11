// JanSetu AI - Skeleton (UI Primitive)
import React from "react";

export interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-skeleton ${className}`}>
      {children || <span>Skeleton Component Placeholder</span>}
    </div>
  );
};

export default Skeleton;
