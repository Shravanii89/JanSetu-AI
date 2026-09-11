// JanSetu AI - Card (UI Primitive)
import React from "react";

export interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-card ${className}`}>
      {children || <span>Card Component Placeholder</span>}
    </div>
  );
};

export default Card;
