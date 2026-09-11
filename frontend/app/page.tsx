import Link from "next/link";
import { Shield, Sparkles, Building2, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6 text-slate-900">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-12">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              JanSetu AI
            </h1>
            <p className="text-sm font-medium text-indigo-600">
              From Citizen Voice to Government Action
            </p>
          </div>
        </div>

        {/* Phase 1 Status Banner */}
        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Phase 1 Technical Foundation Active
              </p>
              <p className="text-xs text-emerald-700">
                Modular Monolith scaffolded • FastAPI Backend & Next.js Frontend operational
              </p>
            </div>
          </div>
        </div>

        {/* Civic Scope Details */}
        <div className="mt-6 space-y-4 text-sm text-slate-600">
          <p className="leading-relaxed">
            <strong className="text-slate-800">JanSetu AI</strong> is an AI-powered civic grievance intelligence and operational resolution platform designed for the <strong>Pune Municipal Corporation (PMC)</strong>. It bridges the gap between unstructured citizen complaints and municipal action.
          </p>

          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Governance Scope</span>
              <p className="mt-1 font-medium text-slate-700">Exactly 4 Roles</p>
              <p className="text-xs text-slate-500">Citizen • Municipal Admin • Dept Officer • Collector</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Department Scope</span>
              <p className="mt-1 font-medium text-slate-700">8 PMC Departments</p>
              <p className="text-xs text-slate-500">Strict taxonomy with zero AI department hallucinations</p>
            </div>
          </div>
        </div>

        {/* Technical Status Footer */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-400" />
            <span>Problem Statement PS02 • Pune Civic Architecture</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-400" />
            <span>Backend RBAC & Deterministic SLA</span>
          </div>
        </div>
      </div>
    </main>
  );
}
