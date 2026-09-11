// JanSetu AI - HowItWorks (Landing Page)
import React from "react";

export interface HowItWorksProps {
  className?: string;
  children?: React.ReactNode;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-howitworks ${className}`}>
      {children || <span>HowItWorks Component Placeholder</span>}
    </div>
  );
};

export default HowItWorks;
