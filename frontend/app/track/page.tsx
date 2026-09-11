"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Shield,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Send,
  Building2,
  Sparkles,
  ArrowRight,
  FileText,
  Calendar,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import Footer from "../../components/layout/Footer";
import { trackComplaint, submitClarification } from "../../lib/api";

export default function TrackPage() {
  const searchParams = useSearchParams();
  const initialId = searchParams?.get("id") || "";

  const [searchId, setSearchId] = useState(initialId);
  const [complaint, setComplaint] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clarification state
  const [clarificationAnswer, setClarificationAnswer] = useState("");
  const [isSubmittingClarif, setIsSubmittingClarif] = useState(false);
  const [clarifSuccessMsg, setClarifSuccessMsg] = useState<string | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  const fetchComplaint = async (id: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    setClarifSuccessMsg(null);
    try {
      const data = await trackComplaint(id.trim());
      setComplaint(data);
    } catch (err: any) {
      setComplaint(null);
      setErrorMessage(err.message || "Grievance record not found. Please verify the tracking number.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchComplaint(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComplaint(searchId);
  };

  const handleClarifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarificationAnswer.trim() || !complaint) return;
    setIsSubmittingClarif(true);
    try {
      await submitClarification(complaint.tracking_number, clarificationAnswer.trim(), "location");
      setClarifSuccessMsg("Clarification submitted successfully. Your grievance is now dispatched to the operational crew!");
      setClarificationAnswer("");
      // Refresh complaint details
      await fetchComplaint(complaint.tracking_number);
    } catch (err: any) {
      setErrorMessage("Failed to submit clarification: " + err.message);
    } finally {
      setIsSubmittingClarif(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2500);
  };

  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case "P0":
        return <span className="rounded-md bg-rose-700 px-2.5 py-1 text-xs font-black text-white shadow-sm">P0 Critical Emergency</span>;
      case "P1":
        return <span className="rounded-md bg-[#F39A32] text-[#123B5D] px-2.5 py-1 text-xs font-black shadow-sm">P1 High Impact</span>;
      case "P2":
        return <span className="rounded-md bg-amber-500 px-2.5 py-1 text-xs font-black text-white shadow-sm">P2 Medium</span>;
      default:
        return <span className="rounded-md bg-[#1F5E91] px-2.5 py-1 text-xs font-black text-white shadow-sm">{prio} Low</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <span className="rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 text-xs font-black">Resolved</span>;
      case "IN_PROGRESS":
        return <span className="rounded-lg bg-blue-100 text-[#1F5E91] border border-blue-300 px-3 py-1.5 text-xs font-black">In Progress</span>;
      case "ASSIGNED":
        return <span className="rounded-lg bg-indigo-100 text-indigo-800 border border-indigo-300 px-3 py-1.5 text-xs font-black">Assigned to Crew</span>;
      case "NEEDS_CLARIFICATION":
        return <span className="rounded-lg bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 text-xs font-black animate-pulse">Awaiting Citizen Info</span>;
      case "ESCALATED":
        return <span className="rounded-lg bg-purple-100 text-purple-800 border border-purple-300 px-3 py-1.5 text-xs font-black">Escalated</span>;
      default:
        return <span className="rounded-lg bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1.5 text-xs font-black">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col selection:bg-[#1F5E91] selection:text-white">
      <PublicNavbar />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-[#E9E9E9] py-4">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#667085]">
            <Link href="/" className="hover:text-[#1F5E91]">Home</Link>
            <span>/</span>
            <span className="font-bold text-[#1F2933]">Citizen Services</span>
            <span>/</span>
            <span className="font-bold text-[#1F5E91]">Track Grievance</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#123B5D]">
            <Building2 className="h-4 w-4 text-[#F39A32]" />
            <span>PMC Civic Redressal</span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Header Card */}
        <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 sm:p-8 shadow-sm mb-6 text-center sm:text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123B5D] text-white">
              <Search className="h-5 w-5 text-[#F39A32]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#123B5D]">
                Track Citizen Grievance
              </h1>
              <p className="text-xs text-[#667085]">
                Enter your PMC tracking number to inspect real-time resolution timeline, assigned engineer, and SLA targets.
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-[#667085] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Tracking ID (e.g. JS-2026-PUN-00101)"
                className="w-full rounded-xl border border-[#E9E9E9] pl-10 pr-4 py-3 text-xs sm:text-sm text-[#1F2933] placeholder-[#667085] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] font-mono bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchId.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F5E91] hover:bg-[#123B5D] px-7 py-3 text-xs sm:text-sm font-bold text-white shadow transition disabled:opacity-50 active:scale-95"
            >
              <Search className="h-4 w-4" />
              <span>{isLoading ? "Searching..." : "Track Status"}</span>
            </button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#667085]">
            <span className="font-bold text-[#1F2933]">Sample Tracking IDs:</span>
            {["JS-2026-PUN-00101", "JS-2026-PUN-00102", "JS-2026-PUN-00111"].map((demoId) => (
              <button
                key={demoId}
                type="button"
                onClick={() => {
                  setSearchId(demoId);
                  fetchComplaint(demoId);
                }}
                className="rounded-lg bg-[#F5F4F0] hover:bg-[#1F5E91] hover:text-white px-2.5 py-1 font-mono text-xs font-bold text-[#1F5E91] border border-[#E9E9E9] transition"
              >
                {demoId}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 flex items-center gap-2 mb-6">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Complaint Details Card */}
        {complaint && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 sm:p-8 shadow-sm">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E9E9] pb-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-[#1F5E91] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {complaint.tracking_number}
                    </span>
                    <button
                      onClick={() => copyToClipboard(complaint.tracking_number)}
                      className="p-1 rounded text-[#667085] hover:text-[#1F5E91] transition"
                      title="Copy Tracking ID"
                    >
                      {copiedTracking ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    {getPriorityBadge(complaint.priority)}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#123B5D]">
                    {complaint.issue_summary || "Civic Grievance"}
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-1">Status</div>
                  {getStatusBadge(complaint.status)}
                </div>
              </div>

              {/* Grid Properties */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-6">
                <div className="rounded-xl border border-[#E9E9E9] bg-[#F5F4F0] p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block mb-1">
                    Assigned Department
                  </span>
                  <span className="font-bold text-[#123B5D] flex items-center gap-1.5 text-sm">
                    <Building2 className="h-4 w-4 text-[#1F5E91]" />
                    {complaint.department_id ? complaint.department_id.replace("_", " ") : "Municipal Dept"}
                  </span>
                </div>

                <div className="rounded-xl border border-[#E9E9E9] bg-[#F5F4F0] p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block mb-1">
                    Location in Pune
                  </span>
                  <span className="font-bold text-[#123B5D] flex items-center gap-1.5 text-sm truncate">
                    <MapPin className="h-4 w-4 text-rose-500" />
                    {complaint.location_name || "Missing (Clarification Required)"}
                  </span>
                </div>

                <div className="rounded-xl border border-[#E9E9E9] bg-[#F5F4F0] p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block mb-1">
                    SLA Resolution Clock
                  </span>
                  <span className="font-bold text-[#123B5D] flex items-center gap-1.5 text-sm">
                    <Clock className="h-4 w-4 text-[#F39A32]" />
                    {complaint.sla?.status || "WITHIN_SLA"}
                  </span>
                </div>
              </div>

              {/* Raw Grievance Text */}
              <div className="rounded-xl bg-[#F5F4F0] border border-[#E9E9E9] p-4 text-xs text-[#1F2933] leading-relaxed mb-6">
                <span className="font-bold text-[#667085] block text-[10px] uppercase tracking-wider mb-1">
                  Citizen&apos;s Original Statement
                </span>
                &ldquo;{complaint.raw_text}&rdquo;
              </div>

              {/* Resolution Notes (if resolved) */}
              {complaint.resolution_notes && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 mb-6">
                  <span className="font-bold block text-emerald-800 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Official Resolution Report
                  </span>
                  <p>{complaint.resolution_notes}</p>
                </div>
              )}

              {/* Interactive Clarification Box if Awaiting Citizen */}
              {complaint.status === "NEEDS_CLARIFICATION" && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 mb-6 text-xs text-amber-950">
                  <div className="flex items-center gap-2 font-bold text-amber-900 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>Action Required: Municipal Team Needs Clarification</span>
                  </div>
                  <p className="text-amber-800 mb-4 leading-relaxed">
                    {complaint.clarifications?.[0]?.question ||
                      "Please provide the exact street, landmark, or area in Pune so the field maintenance crew can reach the spot."}
                  </p>

                  {clarifSuccessMsg && (
                    <div className="mb-4 rounded-lg bg-emerald-100 border border-emerald-300 p-3 text-emerald-800 font-semibold">
                      {clarifSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleClarifySubmit} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={clarificationAnswer}
                      onChange={(e) => setClarificationAnswer(e.target.value)}
                      placeholder="e.g., Baner near Balewadi Phata, opposite Orchid School"
                      className="flex-1 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs text-[#1F2933] focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingClarif || !clarificationAnswer.trim()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#F39A32] hover:bg-[#e08922] text-[#123B5D] font-black px-4 py-2 text-xs shadow transition disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{isSubmittingClarif ? "Submitting..." : "Submit Clarification"}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Vertical Timeline */}
              <div className="border-t border-[#E9E9E9] pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-4 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#1F5E91]" />
                  Verified Progress Timeline
                </h3>

                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E9E9E9]">
                  {complaint.timeline?.map((step: any, idx: number) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1F5E91] text-white shadow-sm ring-4 ring-white z-10">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="flex-1 rounded-xl bg-[#F5F4F0] border border-[#E9E9E9] p-3.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#123B5D]">{step.title}</span>
                          <span className="text-[10px] text-[#667085] font-mono">
                            {new Date(step.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-[#667085] mt-1 leading-snug">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
