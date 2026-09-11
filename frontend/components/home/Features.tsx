"use client";

import React from "react";
import { Brain, Route, Clock, HeartHandshake, Shield, Sparkles } from "lucide-react";

export const Features: React.FC = () => {
  const features = [
    {
      title: "AI-Powered Assistance",
      desc: "Get intelligent guidance and support for citizen services with multilingual natural language understanding.",
      icon: Brain,
      tag: "Intelligent Triage",
    },
    {
      title: "Smart Complaint Routing",
      desc: "Automatically identify and route complaints to relevant departments with zero hallucination guarantee.",
      icon: Route,
      tag: "8 PMC Depts",
    },
    {
      title: "Real-Time Tracking",
      desc: "Track your complaint status and receive updates with deterministic SLA countdown timers.",
      icon: Clock,
      tag: "Public ID",
    },
    {
      title: "Citizen-Centric Services",
      desc: "Access government services through one simple platform designed for every citizen across Maharashtra.",
      icon: HeartHandshake,
      tag: "Accessible",
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#F5F4F0] border-b border-[#E9E9E9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1F5E91]/10 px-3.5 py-1 text-xs font-bold text-[#1F5E91] border border-[#1F5E91]/20 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#F39A32]" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#123B5D] tracking-tight">
            Why Pune Citizens Rely on JanSetu AI
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#667085]">
            Engineered to convert everyday civic voice into verified, actionable municipal outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E9E9E9] bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F4F0] text-[#1F5E91] group-hover:bg-[#1F5E91] group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold text-[#667085] bg-[#F5F4F0] px-2 py-0.5 rounded border border-[#E9E9E9]">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#1F2933] group-hover:text-[#1F5E91] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#667085] mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#F5F4F0] flex items-center gap-1.5 text-xs font-bold text-[#1F5E91]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F39A32]" />
                  <span>PMC Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
