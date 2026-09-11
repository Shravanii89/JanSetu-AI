"use client";

import React from "react";
import Link from "next/link";
import { FileText, Search, ArrowRight, HeartHandshake } from "lucide-react";
import { useTranslation } from "../../context/LanguageContext";
import JanSetuLogo from "../branding/JanSetuLogo";

export const CTASection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#123B5D] via-[#1F5E91] to-[#123B5D] py-16 sm:py-20">
      {/* Background Accent Gradients */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#F39A32]/10 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Emblem Badge */}
        <div className="mb-6 flex justify-center">
          <JanSetuLogo variant="icon" size="lg" theme="dark" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
          {t("cta.heading")}
        </h2>

        <p className="mt-4 text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
          {t("cta.description")}
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/report"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#F39A32] hover:bg-[#e08922] text-[#123B5D] px-8 py-4 text-sm font-black shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-[0.98]"
          >
            <FileText className="h-4 w-4" />
            <span>{t("cta.reportButton")}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/track"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-8 py-4 text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-[0.98]"
          >
            <Search className="h-4 w-4 text-[#F39A32]" />
            <span>{t("cta.trackButton")}</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-white/70">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {t("cta.badgeFree")}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F39A32]" />
            {t("cta.badgeSla")}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            {t("cta.badgeAction")}
          </span>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
