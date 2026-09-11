"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  MapPin,
  Cpu,
  Layers,
  FileText,
  ChevronRight,
  Droplets,
  Zap,
  Trash2,
  Trees,
  Truck,
  Eye,
  Activity,
} from "lucide-react";
import PublicNavbar from "../components/navigation/PublicNavbar";
import { analyzeTextLive } from "../lib/api";

export default function HomePage() {
  const [demoInput, setDemoInput] = useState(
    "There has been no water supply in our area for three days and nobody is responding."
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>({
    complaint_type: "Municipal Water Supply Outage",
    summary: "Municipal Water Supply Outage",
    extracted_duration: "3 days",
    extracted_location: null,
    priority: "P1",
    department: "WATER_SUPPLY",
    department_reason: "Issue concerns municipal potable water supply availability.",
    priority_reason: "Disruption duration exceeds 48 hours without supply.",
    actionability: "PARTIALLY_ACTIONABLE",
    missing_fields: ["location"],
    clarification_questions: ["Which area, street, ward, or nearby landmark is affected?"],
    provider: "Local Deterministic NLP Engine",
  });

  const handleRunDemo = async (customText?: string) => {
    const textToAnalyze = customText || demoInput;
    setIsAnalyzing(true);
    try {
      const res = await analyzeTextLive(textToAnalyze);
      setAiResult(res);
    } catch (err) {
      console.error("AI analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sampleChips = [
    {
      label: "Water Outage (3 Days)",
      text: "There has been no water supply in our area for three days and nobody is responding.",
    },
    {
      label: "P0 Live Electrical Wire",
      text: "EMERGENCY: Live 11kV electrical wire has snapped outside Modern College Shivaji Nagar! High danger to public!",
    },
    {
      label: "Karve Road Potholes",
      text: "Massive 2-feet deep potholes after Nal Stop flyover on Karve Road. Two two-wheelers skidded.",
    },
    {
      label: "Hadapsar Garbage",
      text: "Garbage has not been collected from Hadapsar vegetable market container for 4 days. Stench unbearable.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200 bg-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-60" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/90 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            Problem Statement PS02 • Pune Municipal Corporation (PMC)
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
            From Citizen Voice to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Government Action
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Report civic problems in your own words. JanSetu AI understands the complaint, identifies what is missing,
            determines priority, routes it to the right department, and helps track resolution.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 hover:shadow-indigo-600/35 transition-all"
            >
              <FileText className="h-4 w-4" />
              <span>Report a Complaint</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/track"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              <Search className="h-4 w-4 text-slate-400" />
              <span>Track Complaint</span>
            </Link>
          </div>

          {/* Live Confidence / Trust Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-100">
            <div className="p-3">
              <div className="text-2xl font-black text-slate-900">8</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PMC Departments</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-black text-slate-900">100%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Deterministic SLA</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-black text-slate-900">P0 to P3</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Decoupled Priority</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-black text-slate-900">Multilingual</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">English, Hindi, Marathi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live AI Interactive Transformation Demo Area */}
      <section className="py-16 bg-slate-900 text-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/70 px-3 py-1 rounded-full border border-indigo-800/80 mb-3">
              <Cpu className="h-3.5 w-3.5" /> Interactive Demonstration
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Watch JanSetu AI Structure Unstructured Complaints
            </h2>
            <p className="mt-2 text-slate-400 text-sm">
              Try the exact scenario below or test different civic hazards to see real-time extraction and validation.
            </p>
          </div>

          {/* Preset Chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {sampleChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDemoInput(chip.text);
                  handleRunDemo(chip.text);
                }}
                className="rounded-full bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 text-xs font-medium text-slate-300 border border-slate-700 transition"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Interactive Console Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Input Panel */}
            <div className="lg:col-span-5 rounded-2xl bg-slate-800/90 border border-slate-700 p-6 flex flex-col justify-between shadow-xl">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                  <FileText className="h-4 w-4 text-indigo-400" />
                  Citizen Grievance Input (Unstructured Speech / Text)
                </label>
                <textarea
                  rows={5}
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 p-4 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  placeholder="Type a civic problem..."
                />
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Runs local deterministic NLP + Gemini API fallback
                </span>
                <button
                  onClick={() => handleRunDemo()}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50 transition shadow"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>{isAnalyzing ? "Analyzing..." : "Analyze with AI"}</span>
                </button>
              </div>
            </div>

            {/* Output Transformation Cards */}
            <div className="lg:col-span-7 rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> AI Extraction & Triage Result
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                    {aiResult?.provider || "JanSetu AI Pipeline"}
                  </span>
                </div>

                {/* Structured Fields Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {/* Understanding */}
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">UNDERSTANDING</span>
                    <span className="font-semibold text-slate-100 mt-1 block truncate">
                      {aiResult?.summary || "Water Supply Issue"}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DURATION</span>
                    <span className="font-semibold text-amber-300 mt-1 block">
                      {aiResult?.extracted_duration || "Not specified"}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">LOCATION</span>
                    {aiResult?.extracted_location ? (
                      <span className="font-semibold text-emerald-300 mt-1 block truncate">
                        {aiResult.extracted_location}
                      </span>
                    ) : (
                      <span className="font-semibold text-rose-400 mt-1 block">Missing / Clarify</span>
                    )}
                  </div>

                  {/* Priority */}
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PRIORITY</span>
                    <span
                      className={`font-bold mt-1 inline-block px-2 py-0.5 rounded text-[11px] ${
                        aiResult?.priority === "P0"
                          ? "bg-rose-900/60 text-rose-300 border border-rose-700"
                          : aiResult?.priority === "P1"
                          ? "bg-orange-900/60 text-orange-300 border border-orange-700"
                          : "bg-amber-900/60 text-amber-300 border border-amber-700"
                      }`}
                    >
                      {aiResult?.priority || "P1 High"}
                    </span>
                  </div>

                  {/* Department */}
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DEPARTMENT</span>
                    <span className="font-semibold text-indigo-300 mt-1 block truncate">
                      {aiResult?.department ? aiResult.department.replace("_", " ") : "Water Supply"}
                    </span>
                  </div>

                  {/* Actionability */}
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ACTIONABILITY</span>
                    <span className="font-semibold text-cyan-300 mt-1 block">
                      {aiResult?.actionability ? aiResult.actionability.replace("_", " ") : "Partially Actionable"}
                    </span>
                  </div>
                </div>

                {/* Clarification prompt if location missing */}
                {aiResult?.missing_fields?.length > 0 && (
                  <div className="mt-4 rounded-xl bg-amber-950/40 border border-amber-800/80 p-3 text-xs text-amber-200">
                    <div className="font-bold flex items-center gap-1.5 text-amber-300 mb-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Missing Information Detected
                    </div>
                    <p className="text-[11px] text-amber-200/90">
                      {aiResult.clarification_questions?.[0] || "Which area or landmark is affected?"}
                    </p>
                  </div>
                )}
              </div>

              {/* Explanatory takeaway */}
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                &ldquo;JanSetu AI identifies what the complaint means before sending it to the right operational workflow.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controlled Departments Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Controlled Taxonomy
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              The 8 PMC Municipal Departments
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              AI recommendations are strictly validated against Pune Municipal Corporation&apos;s authorized operational taxonomy. AI never hallucinates an invalid department.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: "WATER_SUPPLY", name: "Water Supply Department", desc: "Drinking water pipeline, outages, contamination & valve operations", icon: Droplets, color: "text-blue-600 bg-blue-50" },
              { id: "ELECTRICITY", name: "Electricity Department", desc: "Street lighting, electrical feeder poles, live wire hazards & transformers", icon: Zap, color: "text-amber-600 bg-amber-50" },
              { id: "PUBLIC_HEALTH", name: "Public Health Department", desc: "Sewage overflow, sanitation, vector disease fogging & drain clearance", icon: Activity, color: "text-emerald-600 bg-emerald-50" },
              { id: "WASTE_MANAGEMENT", name: "Waste Management Department", desc: "Garbage collection, overflowing community bins & open dumping", icon: Trash2, color: "text-rose-600 bg-rose-50" },
              { id: "PUBLIC_PROPERTY_MANAGEMENT", name: "Public Property Management", desc: "Civic bus shelters, community halls & municipal property assets", icon: Building2, color: "text-purple-600 bg-purple-50" },
              { id: "GARDEN", name: "Garden Department", desc: "Public park maintenance, hazardous tree branches & fallen trees", icon: Trees, color: "text-green-600 bg-green-50" },
              { id: "ROAD", name: "Road Department", desc: "Pothole repair, asphalt resurfacing, road cave-ins & divider fixes", icon: Truck, color: "text-orange-600 bg-orange-50" },
              { id: "ENCROACHMENT", name: "Encroachment Department", desc: "Footpath clearances, unauthorized hawkers & illegal hoardings", icon: Shield, color: "text-red-600 bg-red-50" },
            ].map((dept) => {
              const Icon = dept.icon;
              return (
                <div
                  key={dept.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${dept.color} mb-3`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{dept.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{dept.desc}</p>
                  </div>
                  <Link
                    href={`/report?dept=${dept.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>Report issue</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7-Step Core Workflow Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Autonomous Governance Pipeline
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              From Citizen Narrative to Operational Closure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 text-center">
            {[
              { step: "1", title: "Citizen Voice", desc: "Citizen submits grievance in Hindi, Marathi, or English" },
              { step: "2", title: "AI Extraction", desc: "Gemini / Rules extract issue, location, duration & urgency" },
              { step: "3", title: "Validation", desc: "Detects missing info & generates clarification prompts" },
              { step: "4", title: "Ticket & SLA", desc: "Creates verified ticket with deterministic SLA deadline" },
              { step: "5", title: "Department Routing", desc: "Dispatches to relevant PMC field maintenance crew" },
              { step: "6", title: "Resolution", desc: "Officer executes SOP repair and records evidence" },
              { step: "7", title: "Closure", desc: "Citizen notified of verified restoration" },
            ].map((st, i) => (
              <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex flex-col justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs mx-auto mb-2">
                  {st.step}
                </div>
                <h4 className="text-xs font-bold text-slate-800">{st.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Shield className="h-4 w-4 text-indigo-400" />
              <span>JanSetu AI • Pune Municipal Corporation</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              AI-Powered Citizen Grievance Intelligence & Resolution Platform • Problem Statement PS02
            </p>
          </div>

          <div className="flex items-center gap-6 text-slate-300">
            <Link href="/report" className="hover:text-white transition">Report</Link>
            <Link href="/track" className="hover:text-white transition">Track</Link>
            <Link href="/how-it-works" className="hover:text-white transition">How It Works</Link>
            <Link href="/about" className="hover:text-white transition">About</Link>
            <Link href="/login" className="text-amber-400 font-semibold hover:text-amber-300 transition">
              Official Access
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
