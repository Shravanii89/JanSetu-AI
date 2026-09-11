// JanSetu AI - Toast (UI Primitive)
import React from "react";

export interface ToastProps {
  className?: string;
  children?: React.ReactNode;
}

export const Toast: React.FC<ToastProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-toast ${className}`}>
      {children || <span>Toast Component Placeholder</span>}
    </div>
  );
};

export default Toast;
