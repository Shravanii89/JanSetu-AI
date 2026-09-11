// JanSetu AI - Tabs (UI Primitive)
import React from "react";

export interface TabsProps {
  className?: string;
  children?: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-tabs ${className}`}>
      {children || <span>Tabs Component Placeholder</span>}
    </div>
  );
};

export default Tabs;
