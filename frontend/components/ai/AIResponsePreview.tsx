// JanSetu AI - AIResponsePreview (AI Interface)
import React from "react";

export interface AIResponsePreviewProps {
  className?: string;
  children?: React.ReactNode;
}

export const AIResponsePreview: React.FC<AIResponsePreviewProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-airesponsepreview ${className}`}>
      {children || <span>AIResponsePreview Component Placeholder</span>}
    </div>
  );
};

export default AIResponsePreview;
