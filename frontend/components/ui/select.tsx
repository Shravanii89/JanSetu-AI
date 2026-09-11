// JanSetu AI - Select (UI Primitive)
import React from "react";

export interface SelectProps {
  className?: string;
  children?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-select ${className}`}>
      {children || <span>Select Component Placeholder</span>}
    </div>
  );
};

export default Select;
