"use client";

import React from "react";
import { Users, FileWarning, BrainCircuit, Building2, TrendingUp, ShieldCheck } from "lucide-react";

export const ServiceStats: React.FC = () => {
  const stats = [
    {
      title: "Citizen Services",
      count: "50,000+",
      subtitle: "AI-powered citizen assistance",
      icon: Users,
      badge: "Active Redressal",
      iconBg: "bg-blue-50 text-[#1F5E91] border-blue-200",
      accent: "#1F5E91",
    },
    {
      title: "Reported Issues",
      count: "12,480+",
      subtitle: "Track civic complaints",
      icon: FileWarning,
      badge: "88% Resolved",
      iconBg: "bg-amber-50 text-[#F39A32] border-amber-200",
      accent: "#F39A32",
    },
    {
      title: "AI Services",
      count: "99.4%",
      subtitle: "Smart issue classification",
      icon: BrainCircuit,
      badge: "Zero Hallucination",
      iconBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      accent: "#1F5E91",
    },
    {
      title: "Active Departments",
      count: "8 Depts",
      subtitle: "Connected government departments",
      icon: Building2,
      badge: "PMC Operations",
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "#123B5D",
    },
  ];

  return (
    <section className="py-8 sm:py-12 bg-[#F5F4F0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E9E9E9] bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border ${item.iconBg} shadow-sm group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-[#F5F4F0] px-2.5 py-0.5 text-[10px] font-bold text-[#667085] border border-[#E9E9E9]">
                    {item.badge}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-2xl sm:text-3xl font-black text-[#1F2933] tracking-tight">
                    {item.count}
                  </div>
                  <div className="text-sm font-bold text-[#1F5E91] mt-0.5">
                    {item.title}
                  </div>
                  <p className="text-xs text-[#667085] mt-1 font-medium">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceStats;
