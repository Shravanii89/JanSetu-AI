// JanSetu AI - Sidebar (Dashboard)
import React from "react";

export interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-sidebar ${className}`}>
      {children || <span>Sidebar Component Placeholder</span>}
    </div>
  );
};

export default Sidebar;
