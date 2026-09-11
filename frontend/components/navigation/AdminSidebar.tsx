// JanSetu AI - AdminSidebar (Navigation)
import React from "react";

import JanSetuLogo from "../branding/JanSetuLogo";

export interface AdminSidebarProps {
  className?: string;
  children?: React.ReactNode;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ className = "", children }) => {
  return (
    <aside className={`jansetu-adminsidebar bg-[#123B5D] text-white p-4 ${className}`}>
      <div className="mb-4 flex items-center">
        <JanSetuLogo variant="icon" size="sm" theme="dark" href="/admin" />
      </div>
      {children}
    </aside>
  );
};

export default AdminSidebar;
