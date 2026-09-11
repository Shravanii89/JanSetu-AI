// JanSetu AI - CollectorSidebar (Navigation)
import React from "react";

import JanSetuLogo from "../branding/JanSetuLogo";

export interface CollectorSidebarProps {
  className?: string;
  children?: React.ReactNode;
}

export const CollectorSidebar: React.FC<CollectorSidebarProps> = ({ className = "", children }) => {
  return (
    <aside className={`jansetu-collectorsidebar bg-[#123B5D] text-white p-4 ${className}`}>
      <div className="mb-4 flex items-center">
        <JanSetuLogo variant="icon" size="sm" theme="dark" href="/collector" />
      </div>
      {children}
    </aside>
  );
};

export default CollectorSidebar;
