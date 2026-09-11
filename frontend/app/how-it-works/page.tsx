"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  Shield,
  Clock,
  Building2,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Layers,
  Activity,
  AlertTriangle,
  Send,
} from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import Footer from "../../components/layout/Footer";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Citizen Ingestion & Natural Voice",
      desc: "Citizens submit grievances in everyday colloquial language (English, Hindi, Marathi, Hinglish). No prior knowledge of government department jargon is required.",
      points: [
        "Multilingual input processing",
        "Preserves raw citizen statement verbatim",
        "Generates immutable tracking ID (JS-2026-PUN-XXXXX)",
      ],
    },
    {
      num: "02",
      title: "AI Extraction & Entity Triage",
      desc: "Gemini API with local deterministic rule fallbacks extracts complaint category, Pune locality, outage duration, and severity markers inside sandboxed prompts.",
      points: [
        "Prompt injection defense via <citizen_text> sandboxing",
        "Deterministic local fallback when API key is unconfigured",
        "Entity confidence scoring (KNOWN / INFERRED / MISSING)",
      ],
    },
    {
      num: "03",
      title: "Missing Information Detection",
      desc: "If crucial location details are absent, the system identifies the gap and triggers an intelligent clarification prompt rather than silently dropping or misrouting the grievance.",
      points: [
        "Automatic generation of targeted clarification questions",
        "Temporary SLA pause while awaiting citizen response",
        "P0 emergency safety bypass: hazards never blocked by missing metadata",
      ],
    },
    {
      num: "04",
      title: "Controlled Department Routing",
      desc: "The ticket is routed strictly to one of the 8 authorized PMC operational departments. AI recommendations are validated against controlled taxonomy with zero hallucination.",
      points: [
        "Strict 8-department boundary (Water, Road, Electricity, etc.)",
        "Unambiguous mapping with fallback to OTHER_HUMAN_REVIEW",
        "Server-side RBAC isolation ensuring departmental privacy",
      ],
    },
    {
      num: "05",
      title: "Deterministic Priority & SLA Allocation",
      desc: "Priority (P0, P1, P2, P3) is derived deterministically from hazard patterns and service disruption duration, strictly decoupled from citizen sentiment.",
      points: [
        "P0 Critical: 15 min response, 4h resolution target",
        "P1 High: 2h response, 24h resolution target",
        "Automatic SLA breach countdown and warning triggers",
      ],
    },
    {
      num: "06",
      title: "Field Officer Dispatch & Execution",
      desc: "Department engineers inspect AI-recommended standard operating procedures (SOPs), execute maintenance repairs, and upload resolution verification notes.",
      points: [
        "Department-isolated operational work queue",
        "Regulatory audit logging for all status changes",
        "Officer escalation controls to Commissioner or Collector",
      ],
    },
    {
      num: "07",
      title: "Verified Resolution & Citizen Transparency",
      desc: "The ticket status moves to RESOLVED, the SLA clock halts, and the citizen receives a transparent verified resolution report on the public tracking portal.",
      points: [
        "Full progress timeline accessible without login",
        "Resolution notes and timestamped proof",
        "Re-opening option if citizen remains dissatisfied",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col selection:bg-[#1F5E91] selection:text-white">
      <PublicNavbar />

      {/* Breadcrumb / Top Bar */}
      <div className="bg-white border-b border-[#E9E9E9] py-4">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#667085]">
            <Link href="/" className="hover:text-[#1F5E91]">Home</Link>
            <span>/</span>
            <span className="font-bold text-[#1F2933]">Portal Architecture</span>
            <span>/</span>
            <span className="font-bold text-[#1F5E91]">How It Works</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#123B5D]">
            <Shield className="h-4 w-4 text-[#F39A32]" />
            <span>PMC Operational SLA Standard</span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1F5E91]/20 bg-white px-3.5 py-1 text-xs font-bold text-[#1F5E91] mb-4 shadow-sm">
            <Cpu className="h-3.5 w-3.5 text-[#F39A32]" />
            <span>End-to-End Governance Pipeline</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#123B5D] tracking-tight">
            How JanSetu AI Works
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#667085] leading-relaxed">
            From unstructured citizen voice to verified municipal resolution — explore the 7-step autonomous civic grievance pipeline built for Pune Municipal Corporation.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((st) => (
            <div
              key={st.num}
              className="rounded-2xl border border-[#E9E9E9] bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#123B5D] text-white font-black text-base border-2 border-[#1F5E91] shadow-sm">
                {st.num}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#123B5D]">{st.title}</h3>
                <p className="text-xs sm:text-sm text-[#667085] mt-1.5 leading-relaxed">
                  {st.desc}
                </p>
                <div className="mt-4 pt-4 border-t border-[#E9E9E9] flex flex-wrap gap-2">
                  {st.points.map((pt, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5F4F0] px-3 py-1 text-[11px] font-semibold text-[#1F2933] border border-[#E9E9E9]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#1F5E91]" />
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-2xl bg-[#123B5D] text-white p-8 sm:p-10 text-center space-y-4 shadow-xl border-t-4 border-[#F39A32]">
          <h2 className="text-2xl font-black text-white">Experience JanSetu AI Live</h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto leading-relaxed">
            Report a municipal problem in your own words or track existing grievance progress online without logging in.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              href="/report"
              className="rounded-xl bg-[#F39A32] hover:bg-[#e08922] px-6 py-3 text-xs font-black text-[#123B5D] transition shadow active:scale-95"
            >
              Report a Complaint
            </Link>
            <Link
              href="/track"
              className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-6 py-3 text-xs font-bold text-white transition active:scale-95"
            >
              Track Complaint
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
