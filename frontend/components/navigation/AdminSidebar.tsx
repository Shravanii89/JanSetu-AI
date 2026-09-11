// JanSetu AI - AdminSidebar (Navigation)
import React from "react";

export interface AdminSidebarProps {
  className?: string;
  children?: React.ReactNode;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-adminsidebar ${className}`}>
      {children || <span>AdminSidebar Component Placeholder</span>}
    </div>
  );
};

export default AdminSidebar;
