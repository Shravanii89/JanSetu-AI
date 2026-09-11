// JanSetu AI - PublicNavbar (Navigation)
import React from "react";

export interface PublicNavbarProps {
  className?: string;
  children?: React.ReactNode;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-publicnavbar ${className}`}>
      {children || <span>PublicNavbar Component Placeholder</span>}
    </div>
  );
};

export default PublicNavbar;
