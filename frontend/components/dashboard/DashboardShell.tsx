// JanSetu AI - DashboardShell (Dashboard)
import React from "react";

export interface DashboardShellProps {
  className?: string;
  children?: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-dashboardshell ${className}`}>
      {children || <span>DashboardShell Component Placeholder</span>}
    </div>
  );
};

export default DashboardShell;
