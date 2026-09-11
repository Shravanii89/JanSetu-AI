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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 mb-4">
            <Cpu className="h-3.5 w-3.5" /> End-to-End Civic Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How JanSetu AI Works
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            From unstructured citizen voice to verified municipal resolution — explore the 7-step autonomous civic grievance pipeline built for Pune Municipal Corporation.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white font-black text-lg">
                {st.num}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">{st.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {st.desc}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  {st.points.map((pt, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                    >
                      <CheckCircle2 className="h-3 w-3 text-indigo-600" />
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-slate-900 text-white p-8 text-center space-y-4 shadow-xl">
          <h2 className="text-xl font-bold">Experience JanSetu AI Live</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Try lodging a demo complaint or test our real-time interactive AI triage console.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/report"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition"
            >
              Report a Complaint
            </Link>
            <Link
              href="/track"
              className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
            >
              Track Complaint
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
