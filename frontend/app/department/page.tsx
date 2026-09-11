"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  RefreshCw,
  X,
  FileText,
  User,
  MapPin,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import OfficialNavbar from "../../components/navigation/OfficialNavbar";
import {
  getTickets,
  getTicketDetail,
  updateTicketStatus,
  getMe,
} from "../../lib/api";
import { formatDateIST } from "../../lib/date";
import ComplaintLocationCard from "../../components/location/ComplaintLocationCard";

export default function DepartmentPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected ticket management
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [clarificationQuestion, setClarificationQuestion] = useState("");
  const [clarificationModalOpen, setClarificationModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await getMe();
      setCurrentUser(user);

      if (user.role !== "DEPARTMENT_OFFICER" && user.role !== "MUNICIPAL_ADMIN") {
        router.push("/login");
        return;
      }

      // Query tickets - backend enforces department isolation!
      const tix = await getTickets();
      // Ensure recent entries are strictly on top for all departments
      const sorted = [...tix].sort((a, b) => {
        const timeA = new Date(a.created_at || a.submitted_at || 0).getTime();
        const timeB = new Date(b.created_at || b.submitted_at || 0).getTime();
        return timeB - timeA;
      });
      setTickets(sorted);
    } catch (err: any) {
      console.error("Department dashboard error:", err);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenTicket = async (id: string) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      const detail = await getTicketDetail(id);
      setSelectedTicket(detail);
      setDetailModalOpen(true);
    } catch (err: any) {
      alert("Failed to load ticket: " + err.message);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedTicket) return;
    setActionError(null);
    try {
      await updateTicketStatus(
        selectedTicket.id,
        newStatus,
        newStatus === "RESOLVED" ? resolutionNotes || "Repairs executed per standard department operating procedure." : undefined
      );
      setActionSuccess(`Ticket successfully transitioned to ${newStatus}`);
      const updated = await getTicketDetail(selectedTicket.id);
      setSelectedTicket(updated);
      setResolutionNotes("");
      loadData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case "P0":
        return <span className="rounded bg-rose-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">P0 Emergency</span>;
      case "P1":
        return <span className="rounded bg-orange-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">P1 High</span>;
      case "P2":
        return <span className="rounded bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">P2 Med</span>;
      default:
        return <span className="rounded bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">P3 Low</span>;
    }
  };

  const openTicketsCount = tickets.filter((t) => !["RESOLVED", "CLOSED"].includes(t.status)).length;
  const criticalCount = tickets.filter((t) => t.priority === "P0" || t.priority === "P1").length;
  const breachedCount = tickets.filter((t) => t.sla?.status === "BREACHED").length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <OfficialNavbar
        title={`${currentUser?.department_id ? currentUser.department_id.replace("_", " ") : "Department"} Operational Queue`}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Department Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white uppercase tracking-wider">
                Field Operations Center
              </span>
              <span className="text-xs text-slate-500">
                Officer: {currentUser?.full_name || "Official"}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {currentUser?.department_id ? currentUser.department_id.replace("_", " ") : "Department"} Dispatch & Maintenance Queue
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Backend isolated to your assigned department • Real-time SLA tracking and resolution dispatch
            </p>
          </div>

          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Queue</span>
          </button>
        </div>

        {/* Department Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Open Tickets</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{openTicketsCount}</span>
          </div>

          <div className="rounded-xl border border-rose-300 bg-rose-50/70 p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Critical (P0/P1)</span>
            <span className="text-3xl font-black text-rose-700 mt-1 block">{criticalCount}</span>
          </div>

          <div className="rounded-xl border border-red-300 bg-red-50/70 p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">SLA Breached</span>
            <span className="text-3xl font-black text-red-700 mt-1 block">{breachedCount}</span>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Resolved</span>
            <span className="text-3xl font-black text-emerald-700 mt-1 block">{resolvedCount}</span>
          </div>
        </div>

        {/* Priority Dispatch Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  Department Action Queue
                </h2>
                <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                  Recent Entries on Top (IST)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {tickets.length} tickets belonging strictly to {currentUser?.department_id?.replace("_", " ")} • Ordered by latest IST filed time
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Issue Summary</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Filed (IST) ↓</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">SLA State</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">
                      No tickets currently in your department queue.
                    </td>
                  </tr>
                ) : (
                  tickets.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => handleOpenTicket(t.id)}
                      className="hover:bg-slate-50 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 whitespace-nowrap">
                        {t.tracking_number}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        {t.issue_summary}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {t.location_name || <span className="text-rose-500">Missing</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                        {formatDateIST(t.created_at)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getPriorityBadge(t.priority)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 border border-slate-200 text-[11px]">
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-semibold">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                            t.sla?.status === "BREACHED"
                              ? "bg-rose-100 text-rose-800"
                              : t.sla?.status === "AT_RISK"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {t.sla?.status || "WITHIN_SLA"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenTicket(t.id);
                          }}
                          className="inline-flex items-center gap-1 rounded bg-indigo-50 hover:bg-indigo-600 hover:text-white px-3 py-1 text-[11px] font-bold text-indigo-700 transition"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Open Ticket</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Ticket Action Modal */}
      {detailModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {selectedTicket.tracking_number}
                  </span>
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
                <h2 className="text-xl font-black text-slate-900">{selectedTicket.issue_summary}</h2>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {actionSuccess && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                {actionSuccess}
              </div>
            )}
            {actionError && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
                {actionError}
              </div>
            )}

            {/* Quick Properties */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs mb-6">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
                <span className="font-bold text-slate-800 mt-1 block">{selectedTicket.status}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">SLA State</span>
                <span className="font-bold text-slate-800 mt-1 block">{selectedTicket.sla?.status || "WITHIN_SLA"}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                <span className="font-bold text-slate-800 mt-1 block truncate">
                  {selectedTicket.location_name || "Missing"}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Citizen</span>
                <span className="font-bold text-slate-800 mt-1 block truncate">
                  {selectedTicket.citizen_name || "Resident"}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Filed (IST)</span>
                <span className="font-bold text-slate-800 mt-1 block truncate">
                  {formatDateIST(selectedTicket.created_at)}
                </span>
              </div>
            </div>

            {/* Raw Grievance Narrative */}
            <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-700 leading-relaxed mb-6 border border-slate-100">
              <span className="font-bold text-slate-500 block text-[10px] uppercase mb-1">
                Citizen Grievance Description
              </span>
              &ldquo;{selectedTicket.raw_complaint_text}&rdquo;
            </div>

            {/* Complaint Location & Interactive Map */}
            <ComplaintLocationCard
              locationName={selectedTicket.location_name}
              latitude={selectedTicket.latitude}
              longitude={selectedTicket.longitude}
              ward={selectedTicket.ward}
              trackingNumber={selectedTicket.tracking_number}
              className="mb-6"
            />

            {/* AI Analysis & SOP Guidance */}
            {selectedTicket.ai_analysis && (
              <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-4 text-xs text-indigo-950 mb-6">
                <span className="font-bold text-indigo-900 block text-[10px] uppercase mb-1">
                  AI Department SOP Action Recommendations
                </span>
                <ul className="list-disc pl-4 space-y-1 text-[11px] mb-3">
                  {selectedTicket.ai_analysis.recommended_actions?.map((act: string, i: number) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-indigo-200/60 text-[11px] italic text-indigo-800">
                  {selectedTicket.ai_analysis.citizen_response_draft}
                </div>
              </div>
            )}

            {/* Officer Action Controls (FLOW B) */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Officer Dispatch & Resolution Controls
              </h3>

              <div className="flex flex-wrap gap-2">
                {selectedTicket.status !== "IN_PROGRESS" && selectedTicket.status !== "RESOLVED" && (
                  <button
                    onClick={() => handleStatusChange("IN_PROGRESS")}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2"
                  >
                    Accept & Mark In Progress
                  </button>
                )}

                {selectedTicket.status !== "RESOLVED" && (
                  <div className="w-full space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[11px] font-bold text-slate-600 block">
                      Resolution Verification Note
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        placeholder="e.g., Sluice valve replaced; potable water pressure restored."
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs"
                      />
                      <button
                        onClick={() => handleStatusChange("RESOLVED")}
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 shrink-0"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
