"use client";

import React from "react";
import { useTranslation } from "../../context/LanguageContext";
import JanSetuLogo from "../branding/JanSetuLogo";

export const CTASection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#123B5D] via-[#1F5E91] to-[#123B5D] py-10 sm:py-12 lg:py-14">
      {/* Background Accent Gradients */}
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#F39A32]/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* JanSetu Bridge Logo */}
        <div className="mb-4 flex justify-center">
          <JanSetuLogo variant="icon" size="lg" theme="dark" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-sm">
          {t("cta.heading")}
        </h2>

        {/* Description */}
        <p className="mt-2.5 text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
          {t("cta.description")}
        </p>

        {/* Divider & Feature Indicators */}
        <div className="mt-6 pt-5 border-t border-white/15 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs sm:text-sm font-medium text-white/80">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <span>{t("cta.badgeFree")}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F39A32] shrink-0" />
            <span>{t("cta.badgeSla")}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-400 shrink-0" />
            <span>{t("cta.badgeAction")}</span>
          </span>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

