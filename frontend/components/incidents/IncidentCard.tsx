// JanSetu AI - IncidentCard (Incident Intelligence)
import React from "react";

export interface IncidentCardProps {
  className?: string;
  children?: React.ReactNode;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-incidentcard ${className}`}>
      {children || <span>IncidentCard Component Placeholder</span>}
    </div>
  );
};

export default IncidentCard;
