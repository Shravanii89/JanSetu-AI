// JanSetu AI - DepartmentSidebar (Navigation)
import React from "react";

import JanSetuLogo from "../branding/JanSetuLogo";

export interface DepartmentSidebarProps {
  className?: string;
  children?: React.ReactNode;
}

export const DepartmentSidebar: React.FC<DepartmentSidebarProps> = ({ className = "", children }) => {
  return (
    <aside className={`jansetu-departmentsidebar bg-[#123B5D] text-white p-4 ${className}`}>
      <div className="mb-4 flex items-center">
        <JanSetuLogo variant="icon" size="sm" theme="dark" href="/department" />
      </div>
      {children}
    </aside>
  );
};

export default DepartmentSidebar;
