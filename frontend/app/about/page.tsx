"use client";

import React from "react";
import Link from "next/link";
import { Shield, Building2, Cpu, CheckCircle2, Globe, FileText, AlertTriangle, Clock, ArrowRight } from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import Footer from "../../components/layout/Footer";
import { useTranslation } from "../../context/LanguageContext";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col selection:bg-[#1F5E91] selection:text-white">
      <PublicNavbar />

      {/* Breadcrumb / Top Bar */}
      <div className="bg-white border-b border-[#E9E9E9] py-4">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#667085]">
            <Link href="/" className="hover:text-[#1F5E91]">{t("aboutPage.breadcrumbHome")}</Link>
            <span>/</span>
            <span className="font-bold text-[#1F2933]">{t("aboutPage.breadcrumbSection")}</span>
            <span>/</span>
            <span className="font-bold text-[#1F5E91]">{t("aboutPage.breadcrumbCurrent")}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#123B5D]">
            <Building2 className="h-4 w-4 text-[#F39A32]" />
            <span>{t("aboutPage.mandateBadge")}</span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1F5E91]/20 bg-white px-3.5 py-1 text-xs font-bold text-[#1F5E91] mb-4 shadow-sm">
            <Building2 className="h-3.5 w-3.5 text-[#F39A32]" />
            <span>{t("aboutPage.problemStatementBadge")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#123B5D] tracking-tight">
            {t("aboutPage.title")}
          </h1>
          <p className="mt-3 text-sm text-[#667085] leading-relaxed">
            {t("aboutPage.subtitle")}
          </p>
        </div>

        {/* Civic Scope Card */}
        <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#123B5D] flex items-center gap-2 border-b border-[#E9E9E9] pb-3">
            <Shield className="h-5 w-5 text-[#F39A32]" />
            {t("aboutPage.challengeTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-[#1F2933] leading-relaxed">
            {t("aboutPage.challengeP1")}
          </p>
          <p className="text-xs sm:text-sm text-[#1F2933] leading-relaxed">
            {t("aboutPage.challengeP2")}
          </p>
        </div>

        {/* Architectural Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F4F0] text-[#1F5E91] mb-3">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#123B5D] mb-1.5">
              {t("aboutPage.principle1Title")}
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              {t("aboutPage.principle1Desc")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F4F0] text-[#1F5E91] mb-3">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#123B5D] mb-1.5">
              {t("aboutPage.principle2Title")}
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              {t("aboutPage.principle2Desc")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F4F0] text-[#1F5E91] mb-3">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#123B5D] mb-1.5">
              {t("aboutPage.principle3Title")}
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              {t("aboutPage.principle3Desc")}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F4F0] text-[#1F5E91] mb-3">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#123B5D] mb-1.5">
              {t("aboutPage.principle4Title")}
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              {t("aboutPage.principle4Desc")}
            </p>
          </div>
        </div>

        {/* Back / Navigation CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E9E9E9]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1F5E91] hover:text-[#123B5D]"
          >
            <span>{t("aboutPage.returnHome")}</span>
          </Link>

          <Link
            href="/report"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1F5E91] hover:bg-[#123B5D] text-white px-5 py-2.5 text-xs font-bold shadow-sm transition"
          >
            <span>{t("aboutPage.fileComplaint")}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
