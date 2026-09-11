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
import { useTranslation } from "../../context/LanguageContext";

export const ServicesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"citizen" | "complaints" | "ai" | "info">("citizen");
  const { t, language } = useTranslation();

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
      const res = await analyzeTextLive(textToAnalyze, language);
      setAiResult(res);
    } catch (err) {
      console.error("AI analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const samplePresets = [
    { label: t("services.demo.preset1"), text: "There has been no water supply in our area for three days and nobody is responding." },
    { label: t("services.demo.preset2"), text: "EMERGENCY: Live 11kV electrical wire has snapped outside Modern College Shivaji Nagar!" },
    { label: t("services.demo.preset3"), text: "Massive 2-feet deep potholes after Nal Stop flyover on Karve Road. Two scooters skidded." },
    { label: t("services.demo.preset4"), text: "Garbage has not been collected from Hadapsar vegetable market container for 4 days." },
  ];

  // Citizen Services list
  const citizenServices = [
    {
      name: t("services.items.reportCivic.name"),
      desc: t("services.items.reportCivic.desc"),
      icon: FileText,
      href: "/report",
      badge: t("services.items.reportCivic.badge"),
    },
    {
      name: t("services.items.aiAssistant.name"),
      desc: t("services.items.aiAssistant.desc"),
      icon: BrainCircuit,
      href: "/report",
      badge: t("services.items.aiAssistant.badge"),
    },
    {
      name: t("services.items.trackStatus.name"),
      desc: t("services.items.trackStatus.desc"),
      icon: Search,
      href: "/track",
      badge: t("services.items.trackStatus.badge"),
    },
    {
      name: t("services.items.deptInfo.name"),
      desc: t("services.items.deptInfo.desc"),
      icon: Building2,
      href: "/about",
      badge: t("services.items.deptInfo.badge"),
    },
    {
      name: t("services.items.citizenHelp.name"),
      desc: t("services.items.citizenHelp.desc"),
      icon: HelpCircle,
      href: "/how-it-works",
      badge: t("services.items.citizenHelp.badge"),
    },
    {
      name: t("services.items.smartClassification.name"),
      desc: t("services.items.smartClassification.desc"),
      icon: Sparkles,
      href: "/how-it-works",
      badge: t("services.items.smartClassification.badge"),
    },
  ];

  // Complaints tab specific items
  const complaintServices = [
    {
      name: t("services.items.waterIssue.name"),
      desc: t("services.items.waterIssue.desc"),
      icon: Droplets,
      href: "/report?dept=WATER_SUPPLY",
      badge: t("services.items.waterIssue.badge"),
    },
    {
      name: t("services.items.roadIssue.name"),
      desc: t("services.items.roadIssue.desc"),
      icon: FileText,
      href: "/report?dept=ROAD",
      badge: t("services.items.roadIssue.badge"),
    },
    {
      name: t("services.items.powerIssue.name"),
      desc: t("services.items.powerIssue.desc"),
      icon: Zap,
      href: "/report?dept=ELECTRICITY",
      badge: t("services.items.powerIssue.badge"),
    },
    {
      name: t("services.items.garbageIssue.name"),
      desc: t("services.items.garbageIssue.desc"),
      icon: Trash2,
      href: "/report?dept=WASTE_MANAGEMENT",
      badge: t("services.items.garbageIssue.badge"),
    },
    {
      name: t("services.items.drainageIssue.name"),
      desc: t("services.items.drainageIssue.desc"),
      icon: Activity,
      href: "/report?dept=PUBLIC_HEALTH",
      badge: t("services.items.drainageIssue.badge"),
    },
    {
      name: t("services.items.trackActive.name"),
      desc: t("services.items.trackActive.desc"),
      icon: Search,
      href: "/track",
      badge: t("services.items.trackActive.badge"),
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
              <span>{t("services.tag")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1F2933] tracking-tight">
              {t("services.title")}
            </h2>
            <p className="mt-1 text-sm text-[#667085]">
              {t("services.subtitle")}
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
              {t("services.tabs.citizen")}
            </button>
            <button
              onClick={() => setActiveTab("complaints")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === "complaints"
                  ? "bg-[#1F5E91] text-white shadow-sm"
                  : "text-[#1F2933] hover:text-[#1F5E91] hover:bg-white"
              }`}
            >
              {t("services.tabs.complaints")}
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === "ai"
                  ? "bg-[#1F5E91] text-white shadow-sm"
                  : "text-[#1F2933] hover:text-[#1F5E91] hover:bg-white"
              }`}
            >
              {t("services.tabs.ai")}
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === "info"
                  ? "bg-[#1F5E91] text-white shadow-sm"
                  : "text-[#1F2933] hover:text-[#1F5E91] hover:bg-white"
              }`}
            >
              {t("services.tabs.info")}
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
                    <span>{t("services.accessService")}</span>
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
                <span>{t("services.callout.tag")}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#123B5D] leading-snug">
                {t("services.callout.heading1")} <br />
                <span className="text-[#F39A32]">{t("services.callout.heading2")}</span>
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-[#1F2933] leading-relaxed">
                {t("services.callout.description")}
              </p>

              <div className="mt-4 space-y-2.5 text-xs text-[#1F2933]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1F5E91] shrink-0 mt-0.5" />
                  <span><strong>{t("services.callout.bullet1Title")}</strong> {t("services.callout.bullet1Desc")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1F5E91] shrink-0 mt-0.5" />
                  <span><strong>{t("services.callout.bullet2Title")}</strong> {t("services.callout.bullet2Desc")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1F5E91] shrink-0 mt-0.5" />
                  <span><strong>{t("services.callout.bullet3Title")}</strong> {t("services.callout.bullet3Desc")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1F5E91] shrink-0 mt-0.5" />
                  <span><strong>{t("services.callout.bullet4Title")}</strong> {t("services.callout.bullet4Desc")}</span>
                </div>
              </div>
            </div>

            {/* Quick Action in Card */}
            <div className="mt-6 pt-5 border-t border-[#E9E9E9] flex items-center justify-between">
              <Link
                href="/how-it-works"
                className="text-xs font-bold text-[#1F5E91] hover:text-[#123B5D] flex items-center gap-1"
              >
                <span>{t("services.callout.readArchitecture")}</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#F39A32]" />
              </Link>
              <Link
                href="/report"
                className="rounded-lg bg-[#1F5E91] hover:bg-[#123B5D] text-white px-3.5 py-2 text-xs font-bold shadow-sm transition"
              >
                {t("services.callout.fileGrievance")}
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
                <span>{t("services.demo.tag")}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {t("services.demo.title")}
              </h3>
              <p className="text-xs text-white/80 mt-1">
                {t("services.demo.subtitle")}
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
                  {t("services.demo.inputLabel")}
                </label>
                <textarea
                  rows={5}
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  className="w-full rounded-lg bg-[#0c273e] border border-white/20 p-3 text-xs text-white placeholder-white/40 focus:border-[#F39A32] focus:outline-none focus:ring-1 focus:ring-[#F39A32] font-mono leading-relaxed"
                  placeholder={t("services.demo.placeholder")}
                />
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-white/60">
                  {t("services.demo.engineNote")}
                </span>
                <button
                  onClick={() => handleRunDemo()}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#F39A32] hover:bg-[#e08922] px-4 py-2 text-xs font-black text-[#123B5D] transition shadow active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5 fill-[#123B5D]" />
                  <span>{isAnalyzing ? t("services.demo.analyzing") : t("services.demo.analyzeButton")}</span>
                </button>
              </div>
            </div>

            {/* Structured Result Side */}
            <div className="lg:col-span-7 rounded-xl bg-[#0c273e] border border-white/10 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> {t("services.demo.resultTitle")}
                  </span>
                  <span className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded font-mono">
                    {aiResult?.provider || t("services.demo.pipelineBadge")}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                    <span className="text-[10px] font-bold text-white/60 uppercase block">{t("services.demo.fieldUnderstanding")}</span>
                    <span className="font-semibold text-white mt-0.5 block truncate">
                      {aiResult?.summary || "Water Supply Issue"}
                    </span>
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                    <span className="text-[10px] font-bold text-white/60 uppercase block">{t("services.demo.fieldDuration")}</span>
                    <span className="font-semibold text-[#F39A32] mt-0.5 block">
                      {aiResult?.extracted_duration || t("services.demo.notSpecified")}
                    </span>
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                    <span className="text-[10px] font-bold text-white/60 uppercase block">{t("services.demo.fieldLocation")}</span>
                    {aiResult?.extracted_location ? (
                      <span className="font-semibold text-emerald-400 mt-0.5 block truncate">
                        {aiResult.extracted_location}
                      </span>
                    ) : (
                      <span className="font-semibold text-rose-400 mt-0.5 block">{t("services.demo.missingLocation")}</span>
                    )}
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                    <span className="text-[10px] font-bold text-white/60 uppercase block">{t("services.demo.fieldPriority")}</span>
                    <span
                      className={`font-bold mt-0.5 inline-block px-2 py-0.5 rounded text-[10px] ${
                        aiResult?.priority === "P0"
                          ? "bg-rose-950 text-rose-300 border border-rose-700"
                          : aiResult?.priority === "P1"
                          ? "bg-amber-950 text-amber-300 border border-amber-700"
                          : "bg-blue-950 text-blue-300 border border-blue-700"
                      }`}
                    >
                      {aiResult?.priority || "P1"}
                    </span>
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                    <span className="text-[10px] font-bold text-white/60 uppercase block">{t("services.demo.fieldDepartment")}</span>
                    <span className="font-semibold text-cyan-300 mt-0.5 block truncate">
                      {aiResult?.department ? aiResult.department.replace("_", " ") : "Water Supply"}
                    </span>
                  </div>

                  <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                    <span className="text-[10px] font-bold text-white/60 uppercase block">{t("services.demo.fieldActionability")}</span>
                    <span className="font-semibold text-indigo-300 mt-0.5 block">
                      {aiResult?.actionability ? aiResult.actionability.replace("_", " ") : "Actionable"}
                    </span>
                  </div>
                </div>

                {/* Clarification prompt if location missing */}
                {aiResult?.missing_fields?.length > 0 && (
                  <div className="mt-3 rounded-lg bg-amber-950/60 border border-amber-800 p-2.5 text-xs text-amber-200">
                    <div className="font-bold flex items-center gap-1 text-amber-300 mb-0.5">
                      <AlertTriangle className="h-3.5 w-3.5" /> {t("services.demo.missingWarningTitle")}
                    </div>
                    <p className="text-[11px] text-amber-200/90">
                      {aiResult.clarification_questions?.[0] || "Which area or landmark is affected?"}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-white/60 flex items-center justify-between">
                <span>{t("services.demo.footerNote")}</span>
                <Link href="/report" className="text-[#F39A32] font-bold hover:underline flex items-center gap-1">
                  <span>{t("services.demo.submitThisIssue")}</span>
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
