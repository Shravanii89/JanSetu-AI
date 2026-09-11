// JanSetu AI - Department Officer Layout
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col">
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
