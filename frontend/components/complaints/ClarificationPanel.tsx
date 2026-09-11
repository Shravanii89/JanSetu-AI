// JanSetu AI - ClarificationPanel (Complaint Workflow)
import React from "react";

export interface ClarificationPanelProps {
  className?: string;
  children?: React.ReactNode;
}

export const ClarificationPanel: React.FC<ClarificationPanelProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-clarificationpanel ${className}`}>
      {children || <span>ClarificationPanel Component Placeholder</span>}
    </div>
  );
};

export default ClarificationPanel;
