// JanSetu AI - Table (UI Primitive)
import React from "react";

export interface TableProps {
  className?: string;
  children?: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-table ${className}`}>
      {children || <span>Table Component Placeholder</span>}
    </div>
  );
};

export default Table;
