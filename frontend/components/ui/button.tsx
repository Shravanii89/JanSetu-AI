// JanSetu AI - Button (UI Primitive)
import React from "react";

export interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-button ${className}`}>
      {children || <span>Button Component Placeholder</span>}
    </div>
  );
};

export default Button;
