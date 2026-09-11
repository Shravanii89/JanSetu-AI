"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Shield, Search, ArrowRight } from "lucide-react";
import { useTranslation } from "../../context/LanguageContext";

interface HeroProps {
  onSearch?: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center text-white">
        {/* Government Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-white shadow-sm mb-6">
          <span className="flex h-2 w-2 rounded-full bg-[#F39A32] animate-pulse" />
          <span>{t("hero.badge")}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-md">
          {t("hero.titleWelcome")} <span className="text-[#F39A32]">{t("hero.titleBrand")}</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-xl text-white/90 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow">
          {t("hero.subtitle")}
        </p>

        {/* 4. Enhanced Dual CTAs (Intentional & Premium Visual Hierarchy) */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full max-w-xs sm:max-w-none mx-auto">
          {/* Primary Action: Report a Complaint */}
          <button
            type="button"
            onClick={() => router.push("/report")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-[#F39A32] hover:bg-[#e08922] text-[#123B5D] px-8 py-4 text-base font-black shadow-lg shadow-[#F39A32]/25 ring-1 ring-[#F39A32]/40 hover:shadow-xl hover:shadow-[#F39A32]/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 group"
          >
            <Shield className="h-5 w-5 text-[#123B5D] group-hover:scale-110 transition-transform duration-200 shrink-0" />
            <span className="tracking-tight">{t("hero.reportButton")}</span>
            <ArrowRight className="h-4 w-4 text-[#123B5D]/80 group-hover:translate-x-0.5 transition-transform duration-200 hidden sm:inline shrink-0" />
          </button>

          {/* Secondary Action: Track Complaint */}
          <button
            type="button"
            onClick={() => router.push("/track")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/60 backdrop-blur-md px-7 py-4 text-base font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 group"
          >
            <Search className="h-5 w-5 text-[#F39A32] group-hover:scale-110 transition-transform duration-200 shrink-0" />
            <span className="tracking-tight">{t("hero.trackButton")}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
