// JanSetu AI - Input (UI Primitive)
import React from "react";

export interface InputProps {
  className?: string;
  children?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-input ${className}`}>
      {children || <span>Input Component Placeholder</span>}
    </div>
  );
};

export default Input;
