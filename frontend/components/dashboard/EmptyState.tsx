// JanSetu AI - EmptyState (Dashboard)
import React from "react";

export interface EmptyStateProps {
  className?: string;
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-emptystate ${className}`}>
      {children || <span>EmptyState Component Placeholder</span>}
    </div>
  );
};

export default EmptyState;
