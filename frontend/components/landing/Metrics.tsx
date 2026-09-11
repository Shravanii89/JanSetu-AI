// JanSetu AI - Metrics (Landing Page)
import React from "react";

export interface MetricsProps {
  className?: string;
  children?: React.ReactNode;
}

export const Metrics: React.FC<MetricsProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-metrics ${className}`}>
      {children || <span>Metrics Component Placeholder</span>}
    </div>
  );
};

export default Metrics;
