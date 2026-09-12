// JanSetu AI - City-Wide Major Incidents
// TODO: Implement full functionality in Phase 11
import React from "react";
import OfficialNavbar from "../../../components/navigation/OfficialNavbar";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <OfficialNavbar title="City-Wide Major Incidents" />
      <div className="container mx-auto p-6 max-w-7xl flex-1">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">City-Wide Major Incidents</h1>
          <p className="mt-2 text-sm text-slate-600">Major municipal incidents impacting broad citizen populations.</p>
          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
            Scaffolded view — Full interactive UI scheduled for Phase 11.
          </div>
        </div>
      </div>
    </div>
  );
}

