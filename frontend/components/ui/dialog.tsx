// JanSetu AI - Dialog (UI Primitive)
import React from "react";

export interface DialogProps {
  className?: string;
  children?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-dialog ${className}`}>
      {children || <span>Dialog Component Placeholder</span>}
    </div>
  );
};

export default Dialog;
