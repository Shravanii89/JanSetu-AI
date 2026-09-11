// JanSetu AI - Department Officer Layout
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-200 bg-white px-6 py-3 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-900 text-lg">JanSetu AI</span>
          <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
            DEPARTMENT_OFFICER
          </span>
        </div>
        <span className="text-xs text-slate-500">Official Government Access • Pune Municipal Corporation</span>
      </header>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
