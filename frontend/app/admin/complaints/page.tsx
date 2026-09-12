// JanSetu AI - Admin Global Complaints Registry
// TODO: Implement full functionality in Phase 9
import React from "react";
import OfficialNavbar from "../../../components/navigation/OfficialNavbar";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <OfficialNavbar title="Admin Global Complaints Registry" />
      <div className="container mx-auto p-6 max-w-7xl flex-1">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Admin Global Complaints Registry</h1>
          <p className="mt-2 text-sm text-slate-600">Master list of complaints with cross-department filters.</p>
          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
            Scaffolded view — Full interactive UI scheduled for Phase 9.
          </div>
        </div>
      </div>
    </div>
  );
}
