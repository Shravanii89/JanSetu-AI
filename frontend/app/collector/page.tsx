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
      if (tix) setCriticalTickets(tix);
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <OfficialNavbar title="District Collector Intelligence & Grievance Briefing" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Collector Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-md bg-purple-600 px-2.5 py-0.5 text-xs font-bold text-white uppercase tracking-wider">
                District Collectorate Oversight
              </span>
              <span className="text-xs text-slate-400">Pune District Magistrate & Civic Command</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Strategic Civic Intelligence & Escalation Briefing
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Senior executive monitoring for P0 emergencies, SLA breaches, multi-ward systemic failures & departmental accountability.
            </p>
          </div>

          <button
            onClick={loadCollectorData}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-slate-200 transition self-start sm:self-auto border border-slate-700"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Update Intelligence</span>
          </button>
        </div>

        {/* High-Level Intelligence KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-rose-900/60 bg-rose-950/40 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">P0 Life Hazards</span>
              <AlertTriangle className="h-5 w-5 text-rose-500 animate-pulse" />
            </div>
            <span className="text-3xl font-black text-rose-200 mt-2 block">
              {metrics?.critical_p0_count || 1}
            </span>
            <span className="text-[11px] text-rose-400 mt-1 block">Immediate intervention priority</span>
          </div>

          <div className="rounded-2xl border border-red-900/60 bg-red-950/40 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">SLA Breaches</span>
              <Clock className="h-5 w-5 text-red-500" />
            </div>
            <span className="text-3xl font-black text-red-200 mt-2 block">
              {metrics?.sla_breached_count || 2}
            </span>
            <span className="text-[11px] text-red-400 mt-1 block">Overdue beyond legal timelines</span>
          </div>

          <div className="rounded-2xl border border-purple-900/60 bg-purple-950/40 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Active Incidents</span>
              <Activity className="h-5 w-5 text-purple-400" />
            </div>
            <span className="text-3xl font-black text-purple-200 mt-2 block">
              {incidents.length || 2}
            </span>
            <span className="text-[11px] text-purple-400 mt-1 block">Clustered multi-complaint events</span>
          </div>

          <div className="rounded-2xl border border-indigo-900/60 bg-indigo-950/40 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Total Grievances</span>
              <BarChart3 className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="text-3xl font-black text-indigo-200 mt-2 block">
              {metrics?.total_complaints || 35}
            </span>
            <span className="text-[11px] text-indigo-400 mt-1 block">
              {metrics?.resolution_rate || 20}% resolved city-wide
            </span>
          </div>
        </div>

        {/* Clustered Incidents High-Impact Overview */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4" />
            Emerging Civic Incident Clusters (Multi-Citizen Disruption)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incidents.map((inc) => (
              <div key={inc.id} className="rounded-xl border border-purple-900/60 bg-purple-950/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-purple-300">{inc.incident_number}</span>
                  <span className="rounded bg-rose-900/60 text-rose-300 px-2 py-0.5 text-[10px] font-bold border border-rose-700">
                    {inc.severity} Critical • {inc.complaint_count} Complaints
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white">{inc.title}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{inc.description}</p>
                <div className="mt-3 pt-3 border-t border-purple-900/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-rose-400" />
                    {inc.location_name}
                  </span>
                  <span className="font-semibold text-indigo-400">{inc.department_id.replace("_", " ")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Escalations Queue */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4" />
            Direct Escalations Requiring Collector Intervention
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-900 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Issue Narrative</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Escalation Justification</th>
                  <th className="py-3 px-4">SLA State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {criticalTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-slate-500">
                      No escalated cases currently awaiting intervention.
                    </td>
                  </tr>
                ) : (
                  criticalTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-900/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">{t.tracking_number}</td>
                      <td className="py-3 px-4 max-w-xs truncate font-semibold text-white">
                        {t.issue_summary}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{t.department_id.replace("_", " ")}</td>
                      <td className="py-3 px-4">
                        <span className="rounded bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-rose-300 text-[11px] max-w-sm truncate">
                        {t.escalation_reason || "Immediate oversight required."}
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-400">
                        {t.sla?.status || "WITHIN_SLA"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Comparative Performance Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2 mb-4">
            <Building2 className="h-4 w-4" />
            Department Comparative Performance Matrix
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {departments.map((d) => (
              <div key={d.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <span className="font-bold text-xs text-white block truncate">{d.name}</span>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Open</span>
                    <span className="font-bold text-slate-200">{d.open_tickets}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Breached</span>
                    <span className={`font-bold ${d.sla_breached_count > 0 ? "text-rose-400" : "text-slate-200"}`}>
                      {d.sla_breached_count}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Rate</span>
                    <span className="font-bold text-emerald-400">{d.resolution_rate}%</span>
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
