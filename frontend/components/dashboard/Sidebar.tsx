// JanSetu AI - Sidebar (Dashboard)
import React from "react";

import JanSetuLogo from "../branding/JanSetuLogo";

export interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = "", children }) => {
  return (
    <aside className={`jansetu-sidebar bg-[#123B5D] text-white p-4 ${className}`}>
      <div className="mb-4 flex items-center">
        <JanSetuLogo variant="icon" size="sm" theme="dark" />
      </div>
      {children}
    </aside>
  );
};

export default Sidebar;
