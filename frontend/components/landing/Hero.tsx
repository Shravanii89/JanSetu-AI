// JanSetu AI - Hero (Landing Page)
import React from "react";

export interface HeroProps {
  className?: string;
  children?: React.ReactNode;
}

export const Hero: React.FC<HeroProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-hero ${className}`}>
      {children || <span>Hero Component Placeholder</span>}
    </div>
  );
};

export default Hero;
