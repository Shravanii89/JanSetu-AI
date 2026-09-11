"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight, Shield, CheckCircle2, ChevronRight } from "lucide-react";

interface HeroProps {
  onSearch?: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      router.push(`/report?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickServices = [
    { label: "Water Supply Outage", query: "Water supply disruption in my area" },
    { label: "Pothole & Road Repair", query: "Dangerous deep pothole on main road" },
    { label: "Street Light Fault", query: "Street lights not working at night" },
    { label: "Garbage Overflow", query: "Community waste container overflowing" },
    { label: "Drainage Choke", query: "Sewage water overflowing on street" },
  ];

  return (
    <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden">
      {/* 1. Background Image with High Quality Citizens Photo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('/images/hero-citizens.jpg')`,
        }}
        role="img"
        aria-label="Citizens outside modern Jan Seva Kendra"
      />

      {/* 2. Government Dark Blue Overlay with Subtle Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#123B5D]/95 via-[#123B5D]/88 to-[#1F5E91]/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,34,55,0.6)_100%)]" />

      {/* 3. Hero Content Container */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
        {/* Government Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-white shadow-sm mb-6">
          <span className="flex h-2 w-2 rounded-full bg-[#F39A32] animate-pulse" />
          <span>Pune Municipal Corporation • AI Citizen Governance Platform</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-md">
          Welcome to <span className="text-[#F39A32]">JanSetu AI</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-xl text-white/90 max-w-3xl mx-auto font-normal leading-relaxed drop-shadow">
          Empowering Citizens with Seamless Access to Public Services
        </p>

        {/* Large Portal Search Bar */}
        <div className="mt-8 max-w-3xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center rounded-2xl bg-white p-2 shadow-2xl border-2 border-white/80 focus-within:border-[#F39A32] transition-all"
          >
            <div className="pl-3 sm:pl-4 text-[#1F5E91]">
              <Search className="h-6 w-6" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Looking for a service or need help? Search here..."
              className="w-full bg-transparent px-3 py-3 text-sm sm:text-base text-[#1F2933] placeholder-[#667085] focus:outline-none font-medium"
            />

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1F5E91] hover:bg-[#123B5D] px-5 sm:px-8 py-3 text-xs sm:text-sm font-bold text-white shadow transition-all active:scale-[0.98] shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="h-4 w-4 hidden sm:inline" />
            </button>
          </form>

          {/* Quick Service Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-white/70 font-semibold mr-1">Frequent Services:</span>
            {quickServices.map((qs, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(qs.query);
                  if (onSearch) onSearch(qs.query);
                }}
                className="rounded-full bg-white/15 hover:bg-white/25 text-white/95 px-3 py-1 text-[11px] font-medium backdrop-blur-sm border border-white/20 transition-all hover:scale-105 active:scale-95"
              >
                {qs.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dual CTA Quick Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => router.push("/report")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F39A32] hover:bg-[#e08922] text-[#123B5D] px-6 py-3 text-sm font-black shadow-lg transition-all hover:scale-105"
          >
            <Shield className="h-4 w-4" />
            <span>Report a Complaint</span>
          </button>
          <button
            onClick={() => router.push("/track")}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-6 py-3 text-sm font-bold shadow transition-all hover:scale-105"
          >
            <Search className="h-4 w-4 text-[#F39A32]" />
            <span>Track Complaint</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
