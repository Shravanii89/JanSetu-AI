"use client";

import React from "react";
import Link from "next/link";
import { Shield, Building2, Cpu, CheckCircle2, Globe, FileText, AlertTriangle, Clock, ArrowRight } from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import Footer from "../../components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col selection:bg-[#1F5E91] selection:text-white">
      <PublicNavbar />

      {/* Breadcrumb / Top Bar */}
      <div className="bg-white border-b border-[#E9E9E9] py-4">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#667085]">
            <Link href="/" className="hover:text-[#1F5E91]">Home</Link>
            <span>/</span>
            <span className="font-bold text-[#1F2933]">Portal Information</span>
            <span>/</span>
            <span className="font-bold text-[#1F5E91]">About JanSetu AI</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#123B5D]">
            <Building2 className="h-4 w-4 text-[#F39A32]" />
            <span>PMC Governance Mandate</span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1F5E91]/20 bg-white px-3.5 py-1 text-xs font-bold text-[#1F5E91] mb-4 shadow-sm">
            <Building2 className="h-3.5 w-3.5 text-[#F39A32]" />
            <span>Problem Statement PS02 • Pune Municipal Corporation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#123B5D] tracking-tight">
            About JanSetu AI
          </h1>
          <p className="mt-3 text-sm text-[#667085] leading-relaxed">
            AI-Powered Citizen Grievance Intelligence & Resolution Platform for Pune Municipal Corporation (PMC).
          </p>
        </div>

        {/* Civic Scope Card */}
        <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#123B5D] flex items-center gap-2 border-b border-[#E9E9E9] pb-3">
            <Shield className="h-5 w-5 text-[#F39A32]" />
            The Civic Challenge: Unstructured Grievances vs. Municipal Workflows
          </h2>
          <p className="text-xs sm:text-sm text-[#1F2933] leading-relaxed">
            In Pune, citizens report thousands of civic problems daily via social media, WhatsApp, helplines, and municipal ward offices. These complaints are colloquial, emotionally charged, written in Marathi or Hindi, and often missing key operational metadata such as exact landmarks or duration.
          </p>
          <p className="text-xs sm:text-sm text-[#1F2933] leading-relaxed">
            Previously, administrative staff had to manually triage every grievance, determine which of the 8 municipal departments was responsible, and follow up for missing information. <strong>JanSetu AI</strong> bridges this gap by automatically converting unstructured citizen narratives into validated, actionable operational tickets with deterministic SLA targets.
          </p>
        </div>

        {/* Architectural Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F4F0] text-[#1F5E91] mb-3">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#123B5D] mb-1.5">
              AI Recommends, Rules Enforce
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Gemini API extracts understanding, but state machine transitions, SLA deadlines, and database persistence are strictly determined by deterministic Python rules. AI never directly modifies operational database records.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F4F0] text-[#1F5E91] mb-3">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#123B5D] mb-1.5">
              Controlled 8-Department Scope
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Strict taxonomy adherence guarantees zero AI department hallucinations. Department officers are strictly confined to their department&apos;s data via server-side RBAC queries.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F4F0] text-[#1F5E91] mb-3">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#123B5D] mb-1.5">
              Zero Super Admin Governance
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              JanSetu AI adheres to exact 4 roles: Citizen, Municipal Admin, Department Officer, and Collector. Zero arbitrary &ldquo;Super Admin&rdquo; backdoor exists anywhere in the architecture.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F4F0] text-[#1F5E91] mb-3">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#123B5D] mb-1.5">
              Transparent Public Tracking
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Citizens track complaint progress online with an open tracking ID without having to register or log into an official municipal account.
            </p>
          </div>
        </div>

        {/* Back / Navigation CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E9E9E9]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1F5E91] hover:text-[#123B5D]"
          >
            <span>Return to JanSetu AI Home</span>
          </Link>

          <Link
            href="/report"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1F5E91] hover:bg-[#123B5D] text-white px-5 py-2.5 text-xs font-bold shadow-sm transition"
          >
            <span>File a Complaint</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
