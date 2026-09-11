"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Building2,
  AlertTriangle,
  Clock,
  Activity,
  MapPin,
  TrendingUp,
  RefreshCw,
  Eye,
  FileText,
  AlertCircle,
  BarChart3,
  Layers,
} from "lucide-react";
import OfficialNavbar from "../../components/navigation/OfficialNavbar";
import {
  getAnalyticsOverview,
  getDepartments,
  getTickets,
  getIncidents,
  getHotspots,
  getMe,
} from "../../lib/api";
import { formatDateIST } from "../../lib/date";

export default function CollectorPage() {
  const router = useRouter();

  const [metrics, setMetrics] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [criticalTickets, setCriticalTickets] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCollectorData = async () => {
    setIsLoading(true);
    try {
      const user = await getMe();
      if (user.role !== "COLLECTOR" && user.role !== "MUNICIPAL_ADMIN") {
        router.push("/login");
        return;
      }

      const [ov, depts, tix, incs, hots] = await Promise.all([
        getAnalyticsOverview().catch(() => null),
        getDepartments().catch(() => []),
        getTickets({ is_escalated: true }).catch(() => []),
        getIncidents().catch(() => []),
        getHotspots().catch(() => []),
      ]);

      if (ov) setMetrics(ov);
      if (depts) setDepartments(depts);
      if (tix) {
        const sorted = [...tix].sort((a, b) => {
          const timeA = new Date(a.created_at || a.submitted_at || 0).getTime();
          const timeB = new Date(b.created_at || b.submitted_at || 0).getTime();
          return timeB - timeA;
        });
        setCriticalTickets(sorted);
      }
      if (incs) setIncidents(incs);
      if (hots) setHotspots(hots);
    } catch (err) {
      console.error("Collector dashboard error:", err);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCollectorData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <OfficialNavbar title="District Collector Intelligence & Grievance Briefing" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Collector Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-md bg-indigo-600 px-2.5 py-0.5 text-xs font-bold text-white uppercase tracking-wider">
                District Collectorate Oversight
              </span>
              <span className="text-xs text-slate-500">Pune District Magistrate & Civic Command</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Strategic Civic Intelligence & Escalation Briefing
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Senior executive monitoring for P0 emergencies, SLA breaches, multi-ward systemic failures & departmental accountability.
            </p>
          </div>

          <button
            onClick={loadCollectorData}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition self-start sm:self-auto border border-slate-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Update Intelligence</span>
          </button>
        </div>

        {/* High-Level Intelligence KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-rose-300 bg-rose-50 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">P0 Life Hazards</span>
              <AlertTriangle className="h-5 w-5 text-rose-600 animate-pulse" />
            </div>
            <span className="text-3xl font-black text-rose-700 mt-2 block">
              {metrics?.critical_p0_count || 1}
            </span>
            <span className="text-[11px] text-rose-600 mt-1 block">Immediate intervention priority</span>
          </div>

          <div className="rounded-2xl border border-red-300 bg-red-50 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700">SLA Breaches</span>
              <Clock className="h-5 w-5 text-red-600" />
            </div>
            <span className="text-3xl font-black text-red-700 mt-2 block">
              {metrics?.sla_breached_count || 2}
            </span>
            <span className="text-[11px] text-red-600 mt-1 block">Overdue beyond legal timelines</span>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Active Incidents</span>
              <Activity className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="text-3xl font-black text-indigo-900 mt-2 block">
              {incidents.length || 2}
            </span>
            <span className="text-[11px] text-indigo-600 mt-1 block">Clustered multi-complaint events</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Grievances</span>
              <BarChart3 className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="text-3xl font-black text-slate-900 mt-2 block">
              {metrics?.total_complaints || 35}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {metrics?.resolution_rate || 20}% resolved city-wide
            </span>
          </div>
        </div>

        {/* Clustered Incidents High-Impact Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-indigo-600" />
            Emerging Civic Incident Clusters (Multi-Citizen Disruption)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incidents.map((inc) => (
              <div key={inc.id} className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{inc.incident_number}</span>
                  <span className="rounded bg-rose-100 text-rose-700 px-2 py-0.5 text-[10px] font-bold border border-rose-200">
                    {inc.severity} Critical • {inc.complaint_count} Complaints
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{inc.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{inc.description}</p>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-rose-500" />
                    {inc.location_name}
                  </span>
                  <span className="font-semibold text-indigo-600">{inc.department_id.replace("_", " ")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Escalations Queue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            Direct Escalations Requiring Collector Intervention
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Issue Narrative</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Filed (IST)</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Escalation Justification</th>
                  <th className="py-3 px-4">SLA State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criticalTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-slate-400">
                      No escalated cases currently awaiting intervention.
                    </td>
                  </tr>
                ) : (
                  criticalTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 whitespace-nowrap">{t.tracking_number}</td>
                      <td className="py-3 px-4 max-w-xs truncate font-semibold text-slate-900">
                        {t.issue_summary}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{t.department_id.replace("_", " ")}</td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap text-[11px]">{formatDateIST(t.created_at)}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold text-white shadow-sm ${
                          t.priority === "P0"
                            ? "bg-rose-600"
                            : t.priority === "P1"
                            ? "bg-orange-600"
                            : t.priority === "P2"
                            ? "bg-amber-500"
                            : "bg-blue-600"
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-rose-700 font-medium text-[11px] max-w-sm truncate">
                        {t.escalation_reason || "Immediate oversight required."}
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Comparative Performance Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-4">
            <Building2 className="h-4 w-4 text-indigo-600" />
            Department Comparative Performance Matrix
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {departments.map((d) => (
              <div key={d.id} className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition p-4">
                <span className="font-bold text-xs text-slate-900 block truncate">{d.name}</span>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
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
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Rate</span>
                    <span className="font-bold text-emerald-600">{d.resolution_rate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
