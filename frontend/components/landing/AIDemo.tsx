// JanSetu AI - AIDemo (Landing Page)
import React from "react";

export interface AIDemoProps {
  className?: string;
  children?: React.ReactNode;
}

export const AIDemo: React.FC<AIDemoProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-aidemo ${className}`}>
      {children || <span>AIDemo Component Placeholder</span>}
    </div>
  );
};

export default AIDemo;
