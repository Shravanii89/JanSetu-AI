// JanSetu AI - PriorityExplanation (AI Interface)
import React from "react";

export interface PriorityExplanationProps {
  className?: string;
  children?: React.ReactNode;
}

export const PriorityExplanation: React.FC<PriorityExplanationProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-priorityexplanation ${className}`}>
      {children || <span>PriorityExplanation Component Placeholder</span>}
    </div>
  );
};

export default PriorityExplanation;
