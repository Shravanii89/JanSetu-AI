"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Building2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  FileText,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  X,
  AlertCircle,
  Activity,
} from "lucide-react";
import OfficialNavbar from "../../components/navigation/OfficialNavbar";
import {
  getAnalyticsOverview,
  getDepartments,
  getTickets,
  getTicketDetail,
  updateTicketStatus,
  updateTicketPriority,
  rerouteTicket,
  escalateTicket,
  getIncidents,
  getSlaSummary,
} from "../../lib/api";
import { DEPARTMENTS } from "../../lib/constants";
import { formatDateIST } from "../../lib/date";
import ComplaintLocationCard from "../../components/location/ComplaintLocationCard";

export default function AdminPage() {
  const router = useRouter();

  // Dashboard Data State
  const [metrics, setMetrics] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [slaSummary, setSlaSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  // Modal / Action State
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [rerouteModalOpen, setRerouteModalOpen] = useState(false);
  const [newDepartmentId, setNewDepartmentId] = useState("ROAD");
  const [rerouteReason, setRerouteReason] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [ov, depts, tix, incs, sla] = await Promise.all([
        getAnalyticsOverview().catch(() => null),
        getDepartments().catch(() => []),
        getTickets({
          department_id: selectedDept || undefined,
          status: selectedStatus || undefined,
          priority: selectedPriority || undefined,
          search: searchQuery || undefined,
        }).catch(() => []),
        getIncidents().catch(() => []),
        getSlaSummary().catch(() => null),
      ]);

      if (ov) setMetrics(ov);
      if (depts) setDepartments(depts);
      if (tix) {
        const sorted = [...tix].sort((a, b) => {
          const timeA = new Date(a.created_at || a.submitted_at || 0).getTime();
          const timeB = new Date(b.created_at || b.submitted_at || 0).getTime();
          return timeB - timeA;
        });
        setTickets(sorted);
      }
      if (incs) setIncidents(incs);
      if (sla) setSlaSummary(sla);
    } catch (err: any) {
      console.error("Failed to load admin dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedDept, selectedStatus, selectedPriority]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDashboardData();
  };

  const handleOpenTicketDetail = async (ticketId: string) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      const detail = await getTicketDetail(ticketId);
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
        newStatus === "RESOLVED" ? resolutionNotes || "Resolved by Municipal Administration." : undefined
      );
      setActionSuccess(`Ticket status transitioned to ${newStatus}`);
      const updated = await getTicketDetail(selectedTicket.id);
      setSelectedTicket(updated);
      loadDashboardData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!selectedTicket) return;
    setActionError(null);
    try {
      await updateTicketPriority(
        selectedTicket.id,
        newPriority,
        "Municipal Admin manual priority re-calibration"
      );
      setActionSuccess(`Priority updated to ${newPriority}`);
      const updated = await getTicketDetail(selectedTicket.id);
      setSelectedTicket(updated);
      loadDashboardData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleReroute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !rerouteReason.trim()) return;
    setActionError(null);
    try {
      await rerouteTicket(selectedTicket.id, newDepartmentId, rerouteReason.trim());
      setActionSuccess(`Ticket successfully re-routed to ${newDepartmentId}`);
      setRerouteModalOpen(false);
      setRerouteReason("");
      const updated = await getTicketDetail(selectedTicket.id);
      setSelectedTicket(updated);
      loadDashboardData();
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <OfficialNavbar title="Municipal Command Center (All Departments)" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Command Center Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white uppercase tracking-wider">
                Executive Command
              </span>
              <span className="text-xs text-slate-500">Pune Municipal Corporation</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              City-Wide Grievance Operations & SLA Command
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Live operational oversight across all 8 controlled municipal departments.
            </p>
          </div>

          <button
            onClick={loadDashboardData}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        {/* 1. Executive KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {metrics?.total_complaints || 0}
            </span>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">In Progress</span>
            <span className="text-2xl font-black text-blue-900 mt-1 block">
              {metrics?.in_progress || 0}
            </span>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Resolved</span>
            <span className="text-2xl font-black text-emerald-900 mt-1 block">
              {metrics?.resolved || 0}
            </span>
          </div>

          <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">P0 Emergency</span>
            <span className="text-2xl font-black text-rose-700 mt-1 block">
              {metrics?.critical_p0_count || 0}
            </span>
          </div>

          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">SLA At Risk</span>
            <span className="text-2xl font-black text-amber-700 mt-1 block">
              {metrics?.sla_at_risk_count || 0}
            </span>
          </div>

          <div className="rounded-xl border border-red-300 bg-red-50 p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">SLA Breached</span>
            <span className="text-2xl font-black text-red-700 mt-1 block">
              {metrics?.sla_breached_count || 0}
            </span>
          </div>

          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Active Incidents</span>
            <span className="text-2xl font-black text-purple-900 mt-1 block">
              {metrics?.active_incidents || incidents.length}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Resolution %</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {metrics?.resolution_rate || 100}%
            </span>
          </div>
        </div>

        {/* 2. Department Workload Grid */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-600" />
                Workload by Controlled Department
              </h2>
              <p className="text-xs text-slate-500">Live ticket volumes across all 8 operational departments</p>
            </div>
            <span className="text-xs text-slate-400 font-semibold">{departments.length} Active Departments</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {departments.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDept(selectedDept === d.id ? "" : d.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  selectedDept === d.id
                    ? "border-indigo-600 bg-indigo-50/70 shadow-sm"
                    : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-900 truncate">{d.name}</span>
                  {d.critical_p0_count > 0 && (
                    <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white animate-pulse">
                      {d.critical_p0_count} P0
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Open</span>
                    <span className="font-bold text-slate-900">{d.open_tickets}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Breached</span>
                    <span className={`font-bold ${d.sla_breached_count > 0 ? "text-rose-600" : "text-slate-900"}`}>
                      {d.sla_breached_count}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Resolved</span>
                    <span className="font-bold text-emerald-600">{d.resolved_count}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Operational Ticket Management Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Live Complaints & Operational Tickets Queue
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {tickets.length} tickets • Click any ticket to inspect AI explanation, SLA clock, or re-route department
              </p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tracking, area..."
                  className="rounded-lg border border-slate-300 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
              </form>

              {/* Status filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="NEW">New</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="NEEDS_CLARIFICATION">Needs Clarification</option>
                <option value="RESOLVED">Resolved</option>
                <option value="ESCALATED">Escalated</option>
              </select>

              {/* Priority filter */}
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white"
              >
                <option value="">All Priorities</option>
                <option value="P0">P0 Critical</option>
                <option value="P1">P1 High</option>
                <option value="P2">P2 Medium</option>
                <option value="P3">P3 Low</option>
              </select>

              {(selectedDept || selectedStatus || selectedPriority || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedDept("");
                    setSelectedStatus("");
                    setSelectedPriority("");
                    setSearchQuery("");
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 px-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Tickets Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Summary</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">SLA State</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No complaints match the selected filters.
                    </td>
                  </tr>
                ) : (
                  tickets.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => handleOpenTicketDetail(t.id)}
                      className="hover:bg-indigo-50/40 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 whitespace-nowrap">
                        {t.tracking_number}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate font-semibold text-slate-900">
                        {t.issue_summary}
                        {t.location_name && (
                          <span className="block text-[11px] text-slate-400 font-normal truncate">
                            {t.location_name}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        {t.department_id.replace("_", " ")}
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
                            handleOpenTicketDetail(t.id);
                          }}
                          className="inline-flex items-center gap-1 rounded bg-slate-100 hover:bg-indigo-600 hover:text-white px-2.5 py-1 text-[11px] font-bold text-slate-700 transition"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Clustered Incidents Panel */}
        {incidents.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-purple-600" />
              Active Systemic Clustered Incidents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incidents.map((inc) => (
                <div key={inc.id} className="rounded-xl border border-purple-200 bg-purple-50/30 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-purple-700">{inc.incident_number}</span>
                    <span className="rounded bg-purple-100 text-purple-800 px-2 py-0.5 text-[10px] font-bold">
                      {inc.complaint_count} Linked Complaints
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{inc.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{inc.description}</p>
                  <div className="mt-3 pt-3 border-t border-purple-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Location: {inc.location_name}</span>
                    <span className="font-semibold text-indigo-700">{inc.department_id.replace("_", " ")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Ticket Management Drawer / Modal */}
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

            {/* Ticket Information Details */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs mb-6">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                <span className="font-bold text-slate-800 mt-1 block">
                  {selectedTicket.department_id.replace("_", " ")}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                <span className="font-bold text-slate-800 mt-1 block truncate">
                  {selectedTicket.location_name || "Missing"}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span className="font-bold text-slate-800 mt-1 block">{selectedTicket.status}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">SLA Status</span>
                <span className="font-bold text-slate-800 mt-1 block">
                  {selectedTicket.sla?.status || "WITHIN_SLA"}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Filed At (IST)</span>
                <span className="font-bold text-slate-800 mt-1 block truncate">
                  {formatDateIST(selectedTicket.created_at)}
                </span>
              </div>
            </div>

            {/* Raw Grievance Text */}
            <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-700 leading-relaxed mb-6 border border-slate-100">
              <span className="font-bold text-slate-500 block text-[10px] uppercase mb-1">
                Citizen Narrative ({selectedTicket.citizen_name || "Citizen"})
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

            {/* AI Analysis Explanation */}
            {selectedTicket.ai_analysis && (
              <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-4 text-xs text-indigo-950 mb-6">
                <span className="font-bold text-indigo-900 block text-[10px] uppercase mb-1">
                  AI Explainability & SOP Recommendations
                </span>
                <p className="text-[11px] mb-2">{selectedTicket.ai_analysis.explanation}</p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  {selectedTicket.ai_analysis.recommended_actions?.map((act: string, i: number) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Municipal Admin Action Controls */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Admin Interventions & Operational Controls
              </h3>

              <div className="flex flex-wrap gap-2">
                {selectedTicket.status !== "IN_PROGRESS" && selectedTicket.status !== "RESOLVED" && (
                  <button
                    onClick={() => handleStatusChange("IN_PROGRESS")}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2"
                  >
                    Mark In Progress
                  </button>
                )}

                <button
                  onClick={() => setRerouteModalOpen(true)}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2"
                >
                  Re-Route Department
                </button>

                {selectedTicket.priority !== "P0" && (
                  <button
                    onClick={() => handlePriorityChange("P0")}
                    className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2"
                  >
                    Escalate to P0 Emergency
                  </button>
                )}

                {selectedTicket.status !== "RESOLVED" && (
                  <div className="w-full flex gap-2 pt-2">
                    <input
                      type="text"
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Enter resolution notes..."
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                    />
                    <button
                      onClick={() => handleStatusChange("RESOLVED")}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 shrink-0"
                    >
                      Mark Resolved
                    </button>
                  </div>
                )}
              </div>

              {/* Reroute Sub-Modal */}
              {rerouteModalOpen && (
                <form onSubmit={handleReroute} className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 space-y-3 mt-4">
                  <h4 className="text-xs font-bold text-indigo-900">Re-route to Controlled Department</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={newDepartmentId}
                      onChange={(e) => setNewDepartmentId(e.target.value)}
                      className="rounded-lg border border-indigo-300 p-2 text-xs font-semibold bg-white text-slate-800"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      required
                      value={rerouteReason}
                      onChange={(e) => setRerouteReason(e.target.value)}
                      placeholder="Official reason for re-routing..."
                      className="rounded-lg border border-indigo-300 p-2 text-xs text-slate-800"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setRerouteModalOpen(false)}
                      className="text-xs text-slate-600 px-3 py-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-indigo-600 text-white text-xs font-bold px-4 py-1.5"
                    >
                      Confirm Re-route
                    </button>
                  </div>
                </form>
              )}

              {/* Audit Log Trail */}
              {selectedTicket.audit_trail?.length > 0 && (
                <div className="border-t border-slate-100 pt-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">
                    Regulatory Audit Trail (Immutable)
                  </span>
                  <div className="space-y-1.5 font-mono text-[10px] text-slate-600 max-h-32 overflow-y-auto">
                    {selectedTicket.audit_trail.map((a: any) => (
                      <div key={a.id} className="p-1.5 rounded bg-slate-50 border border-slate-100 flex justify-between">
                        <span>[{a.action}] by {a.actor_type}</span>
                        <span className="text-slate-400">{formatDateIST(a.created_at)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
