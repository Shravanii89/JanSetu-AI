"use client";

import React from "react";
import Link from "next/link";
import { Shield, Building2, Cpu, CheckCircle2, Globe, FileText, AlertTriangle, Clock } from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 mb-4">
            <Building2 className="h-3.5 w-3.5" /> Civic Problem Statement PS02
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            About JanSetu AI
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            AI-Powered Citizen Grievance Intelligence & Resolution Platform for the Pune Municipal Corporation (PMC).
          </p>
        </div>

        {/* Civic Scope Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            The Problem: Unstructured Grievances vs. Municipal Workflows
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In Pune, citizens report thousands of civic problems daily via Twitter, WhatsApp, phone helplines, and municipal portals. These complaints are often colloquial, emotionally charged, written in Marathi or Hindi, and missing key operational metadata such as exact landmarks.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Previously, administrative staff had to manually triage every grievance, determine which municipal department was responsible, and follow up for missing information. <strong>JanSetu AI</strong> bridges this gap by automatically converting unstructured citizen narratives into validated, actionable operational tickets with deterministic SLA targets.
          </p>
        </div>

        {/* Architectural Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Cpu className="h-4 w-4 text-indigo-600" />
              AI Recommends, Rules Enforce
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gemini API extracts understanding, but state machine transitions, SLA deadlines, and database persistence are strictly determined by deterministic Python code. AI never directly modifies database records.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-indigo-600" />
              Controlled 8-Department Scope
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict taxonomy adherence guarantees zero AI department hallucinations. Department officers are strictly confined to their department&apos;s data via server-side RBAC queries.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-indigo-600" />
              Zero Super Admin Rule
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              JanSetu AI adheres to exact 4 roles: Citizen, Municipal Admin, Department Officer, and Collector. Zero Super Admin exists anywhere in the architecture.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-indigo-600" />
              Transparent Public Tracking
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens track complaint progress online with an open tracking ID without having to register or log into an official municipal account.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            <span>Return to JanSetu AI Home</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
