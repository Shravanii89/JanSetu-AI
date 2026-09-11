// JanSetu AI - MissingInformation (AI Interface)
import React from "react";

export interface MissingInformationProps {
  className?: string;
  children?: React.ReactNode;
}

export const MissingInformation: React.FC<MissingInformationProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-missinginformation ${className}`}>
      {children || <span>MissingInformation Component Placeholder</span>}
    </div>
  );
};

export default MissingInformation;
