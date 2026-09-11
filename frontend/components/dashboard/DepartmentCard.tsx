// JanSetu AI - DepartmentCard (Dashboard)
import React from "react";

export interface DepartmentCardProps {
  className?: string;
  children?: React.ReactNode;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-departmentcard ${className}`}>
      {children || <span>DepartmentCard Component Placeholder</span>}
    </div>
  );
};

export default DepartmentCard;
