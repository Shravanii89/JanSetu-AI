// JanSetu AI - DropdownMenu (UI Primitive)
import React from "react";

export interface DropdownMenuProps {
  className?: string;
  children?: React.ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-dropdownmenu ${className}`}>
      {children || <span>DropdownMenu Component Placeholder</span>}
    </div>
  );
};

export default DropdownMenu;
