// JanSetu AI - Textarea (UI Primitive)
import React from "react";

export interface TextareaProps {
  className?: string;
  children?: React.ReactNode;
}

export const Textarea: React.FC<TextareaProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-textarea ${className}`}>
      {children || <span>Textarea Component Placeholder</span>}
    </div>
  );
};

export default Textarea;
