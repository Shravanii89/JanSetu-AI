"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  BrainCircuit,
  Building2,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Shield,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  ArrowRight,
  Droplets,
  Zap,
  Trash2,
  Activity,
} from "lucide-react";
import { analyzeTextLive } from "../../lib/api";

export const ServicesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"citizen" | "complaints" | "ai" | "info">("citizen");

  // State for the embedded Live AI Triage Demo
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

  const samplePresets = [
    { label: "Water Outage (3 Days)", text: "There has been no water supply in our area for three days and nobody is responding." },
    { label: "P0 Live Wire", text: "EMERGENCY: Live 11kV electrical wire has snapped outside Modern College Shivaji Nagar!" },
    { label: "Karve Road Potholes", text: "Massive 2-feet deep potholes after Nal Stop flyover on Karve Road. Two scooters skidded." },
    { label: "Hadapsar Garbage", text: "Garbage has not been collected from Hadapsar vegetable market container for 4 days." },
  ];

  // Services list
  const citizenServices = [
    {
      name: "Report Civic Issue",
      desc: "File complaints in English, Hindi, or Marathi with automatic AI understanding.",
      icon: FileText,
      href: "/report",
      badge: "Citizen Action",
    },
    {
      name: "AI Complaint Assistant",
      desc: "Real-time AI entity triage, missing field validation, and SLA estimator.",
      icon: BrainCircuit,
      href: "/report",
      badge: "AI Powered",
    },
    {
      name: "Track Complaint Status",
      desc: "Instant live tracking with tracking number without needing official login.",
      icon: Search,
      href: "/track",
      badge: "Public Access",
    },
    {
      name: "Department Information",
      desc: "Explore 8 PMC municipal departments, field jurisdictions, and SLAs.",
      icon: Building2,
      href: "/about",
      badge: "PMC Directory",
    },
    {
      name: "Citizen Help & FAQs",
      desc: "Learn about municipal service standards, grievance redressal, and rights.",
      icon: HelpCircle,
      href: "/how-it-works",
      badge: "Citizen Guide",
    },
    {
      name: "Smart Issue Classification",
      desc: "Deterministic P0-P3 priority assignment based on hazard risk and duration.",
      icon: Sparkles,
      href: "/how-it-works",
      badge: "Autonomous",
    },
  ];

  const complaintServices = [
    {
      name: "Water Supply Disruptions",
      desc: "Report dry pipelines, dirty water supply, low water pressure, and leakages.",
      icon: Droplets,
      href: "/report?dept=WATER_SUPPLY",
      badge: "Water Supply",
    },
    {
      name: "Road Potholes & Dividers",
      desc: "Report damaged asphalt, crater potholes, cave-ins, and divider hazards.",
      icon: FileText,
      href: "/report?dept=ROAD",
      badge: "Road Dept",
    },
    {
      name: "Street Light & Power Hazards",
      desc: "Report dark streetlights, exposed junction boxes, and snapped live wires.",
      icon: Zap,
      href: "/report?dept=ELECTRICITY",
      badge: "Electricity",
    },
    {
      name: "Garbage & Solid Waste",
      desc: "Report uncollected garbage bins, open dumping, and dead animal clearance.",
      icon: Trash2,
      href: "/report?dept=WASTE_MANAGEMENT",
      badge: "Waste Mgmt",
    },
    {
      name: "Drainage & Sewage Overflow",
      desc: "Report choked stormwater drains, sewage spills, and mosquito breeding.",
      icon: Activity,
      href: "/report?dept=PUBLIC_HEALTH",
      badge: "Public Health",
    },
    {
      name: "Track Active Ticket",
      desc: "Check real-time resolution timeline, assigned engineer, and evidence photos.",
      icon: Search,
      href: "/track",
      badge: "24x7 Live",
    },
  ];

  const currentServicesList = activeTab === "complaints" ? complaintServices : citizenServices;

  return (
    <section className="py-12 lg:py-16 bg-white border-b border-[#E9E9E9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#1F5E91] mb-2">
              <Shield className="h-3.5 w-3.5" />
              <span>Municipal Redressal Services</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1F2933] tracking-tight">
              JanSetu AI Citizen Services
            </h2>
            <p className="mt-1 text-sm text-[#667085]">
              Select a category to explore public services or test our real-time AI triage engine.
            </p>
          </div>

          {/* Service Tabs (Blue Pill Design) */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#F5F4F0] border border-[#E9E9E9] self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("citizen")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === "citizen"
                  ? "bg-[#1F5E91] text-white shadow-sm"
                  : "text-[#1F2933] hover:text-[#1F5E91] hover:bg-white"
              }`}
            >
              Citizen
            </button>
            <button
              onClick={() => setActiveTab("complaints")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === "complaints"
                  ? "bg-[#1F5E91] text-white shadow-sm"
                  : "text-[#1F2933] hover:text-[#1F5E91] hover:bg-white"
              }`}
            >
              Complaints
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === "ai"
                  ? "bg-[#1F5E91] text-white shadow-sm"
                  : "text-[#1F2933] hover:text-[#1F5E91] hover:bg-white"
              }`}
            >
              AI Services
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === "info"
                  ? "bg-[#1F5E91] text-white shadow-sm"
                  : "text-[#1F2933] hover:text-[#1F5E91] hover:bg-white"
              }`}
            >
              Information
            </button>
          </div>
        </div>

        {/* Tab Content Grid: Left Side (Services List) + Right Side (Informative Section / AI Console) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Services Cards (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentServicesList.map((service, idx) => {
              const Icon = service.icon;
              return (
                <Link
                  key={idx}
                  href={service.href}
                  className="rounded-xl border border-[#E9E9E9] bg-white p-5 hover:border-[#1F5E91] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F4F0] text-[#1F5E91] group-hover:bg-[#1F5E91] group-hover:text-white transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold text-[#667085] bg-[#F5F4F0] px-2 py-0.5 rounded border border-[#E9E9E9]">
                        {service.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1F2933] group-hover:text-[#1F5E91] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F5F4F0] flex items-center justify-between text-xs font-bold text-[#1F5E91]">
                    <span>Access Service</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-[#F39A32]" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Column: Informative Overview Card with Highlights & Embedded Live Demo (5 Cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-[#E9E9E9] bg-[#F5F4F0] p-6 sm:p-7 flex flex-col justify-between shadow-sm">
            <div>
              {/* Highlight Heading */}
              <div className="inline-flex items-center gap-2 text-xs font-black text-[#F39A32] uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5 fill-[#F39A32]" />
                <span>Next-Gen Governance</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#123B5D] leading-snug">
                Empowering Citizens. <br />
                <span className="text-[#F39A32]">Smarter Government Services.</span>
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-[#1F2933] leading-relaxed">
                JanSetu AI is an intelligent citizen service platform that helps citizens report civic issues, access public services, track complaints, and connect with relevant departments through AI-powered technology.
              </p>

              <div className="mt-4 space-y-2.5 text-xs text-[#1F2933]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1F5E91] shrink-0 mt-0.5" />
                  <span><strong>AI-Powered Classification:</strong> Understands colloquial Hindi, Marathi, and English without government jargon.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1F5E91] shrink-0 mt-0.5" />
                  <span><strong>Smart Routing:</strong> Automatically identifies responsible departments with zero hallucination.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1F5E91] shrink-0 mt-0.5" />
                  <span><strong>Complaint Tracking:</strong> Real-time transparent timeline with deterministic SLA countdown.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1F5E91] shrink-0 mt-0.5" />
                  <span><strong>Faster Responses & Better Experience:</strong> Emergency P0 hazards are escalated within 15 minutes.</span>
                </div>
              </div>
            </div>

            {/* Quick Action in Card */}
            <div className="mt-6 pt-5 border-t border-[#E9E9E9] flex items-center justify-between">
              <Link
                href="/how-it-works"
                className="text-xs font-bold text-[#1F5E91] hover:text-[#123B5D] flex items-center gap-1"
              >
                <span>Read Governance Architecture</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#F39A32]" />
              </Link>
              <Link
                href="/report"
                className="rounded-lg bg-[#1F5E91] hover:bg-[#123B5D] text-white px-3.5 py-2 text-xs font-bold shadow-sm transition"
              >
                File Grievance
              </Link>
            </div>
          </div>
        </div>

        {/* Live AI Transformation Demo Console (Embedded Right Below) */}
        <div className="mt-12 rounded-2xl border border-[#123B5D]/20 bg-[#123B5D] text-white p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#F39A32] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full mb-2">
                <BrainCircuit className="h-3.5 w-3.5" />
                <span>Interactive Live AI Demonstration</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Experience JanSetu AI Structuring Unstructured Grievances
              </h3>
              <p className="text-xs text-white/80 mt-1">
                Type any real-world civic complaint or click sample scenarios to see real-time AI entity extraction and department routing.
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
              {samplePresets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDemoInput(p.text);
                    handleRunDemo(p.text);
                  }}
                  className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-1 text-[11px] font-medium text-white border border-white/15 transition hover:scale-105 active:scale-95"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Input Side */}
            <div className="lg:col-span-5 rounded-xl bg-white/5 border border-white/10 p-5 flex flex-col justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5 mb-2">
                  <FileText className="h-4 w-4 text-[#F39A32]" />
                  Citizen Grievance Input (Natural Voice / Text)
                </label>
                <textarea
                  rows={5}
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  className="w-full rounded-lg bg-[#0c273e] border border-white/20 p-3 text-xs text-white placeholder-white/40 focus:border-[#F39A32] focus:outline-none focus:ring-1 focus:ring-[#F39A32] font-mono leading-relaxed"
                  placeholder="Describe a civic problem..."
                />
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-white/60">
                  Local Deterministic Engine + Gemini AI API
                </span>
                <button
                  onClick={() => handleRunDemo()}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#F39A32] hover:bg-[#e08922] px-4 py-2 text-xs font-black text-[#123B5D] transition shadow active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5 fill-[#123B5D]" />
                  <span>{isAnalyzing ? "Analyzing..." : "Analyze with AI"}</span>
                </button>
              </div>
            </div>

            {/* Structured Result Side */}
            <div className="lg:col-span-7 rounded-xl bg-[#0c273e] border border-white/10 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> AI Extraction & Triage Result
                  </span>
                  <span className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded font-mono">
                    {aiResult?.provider || "JanSetu AI Pipeline"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                    <span className="text-[10px] font-bold text-white/60 uppercase block">UNDERSTANDING</span>
                    <span className="font-semibold text-white mt-0.5 block truncate">
                      {aiResult?.summary || "Water Supply Issue"}
                    </span>
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                    <span className="text-[10px] font-bold text-white/60 uppercase block">DURATION</span>
                    <span className="font-semibold text-[#F39A32] mt-0.5 block">
                      {aiResult?.extracted_duration || "Not specified"}
                    </span>
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                    <span className="text-[10px] font-bold text-white/60 uppercase block">LOCATION</span>
                    {aiResult?.extracted_location ? (
                      <span className="font-semibold text-emerald-400 mt-0.5 block truncate">
                        {aiResult.extracted_location}
                      </span>
                    ) : (
                      <span className="font-semibold text-rose-400 mt-0.5 block">Missing / Clarify</span>
                    )}
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                    <span className="text-[10px] font-bold text-white/60 uppercase block">PRIORITY</span>
                    <span
                      className={`font-bold mt-0.5 inline-block px-2 py-0.5 rounded text-[10px] ${
                        aiResult?.priority === "P0"
                          ? "bg-rose-950 text-rose-300 border border-rose-700"
                          : aiResult?.priority === "P1"
                          ? "bg-amber-950 text-amber-300 border border-amber-700"
                          : "bg-blue-950 text-blue-300 border border-blue-700"
                      }`}
                    >
                      {aiResult?.priority || "P1 High"}
                    </span>
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                    <span className="text-[10px] font-bold text-white/60 uppercase block">DEPARTMENT</span>
                    <span className="font-semibold text-cyan-300 mt-0.5 block truncate">
                      {aiResult?.department ? aiResult.department.replace("_", " ") : "Water Supply"}
                    </span>
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                    <span className="text-[10px] font-bold text-white/60 uppercase block">ACTIONABILITY</span>
                    <span className="font-semibold text-indigo-300 mt-0.5 block">
                      {aiResult?.actionability ? aiResult.actionability.replace("_", " ") : "Partially Actionable"}
                    </span>
                  </div>
                </div>

                {/* Clarification prompt if location missing */}
                {aiResult?.missing_fields?.length > 0 && (
                  <div className="mt-3 rounded-lg bg-amber-950/60 border border-amber-800 p-2.5 text-xs text-amber-200">
                    <div className="font-bold flex items-center gap-1 text-amber-300 mb-0.5">
                      <AlertTriangle className="h-3.5 w-3.5" /> Missing Information Detected
                    </div>
                    <p className="text-[11px] text-amber-200/90">
                      {aiResult.clarification_questions?.[0] || "Which area or landmark is affected?"}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-white/60 flex items-center justify-between">
                <span>Deterministic rules validate all classifications before saving.</span>
                <Link href="/report" className="text-[#F39A32] font-bold hover:underline flex items-center gap-1">
                  <span>Submit This Issue</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
