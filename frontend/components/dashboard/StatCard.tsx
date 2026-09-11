// JanSetu AI - StatCard (Dashboard)
import React from "react";

export interface StatCardProps {
  className?: string;
  children?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-statcard ${className}`}>
      {children || <span>StatCard Component Placeholder</span>}
    </div>
  );
};

export default StatCard;
