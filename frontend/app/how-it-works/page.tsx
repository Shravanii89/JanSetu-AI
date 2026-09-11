"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  Shield,
  Clock,
  Building2,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Layers,
  Activity,
  AlertTriangle,
  Send,
} from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import Footer from "../../components/layout/Footer";
import { useTranslation } from "../../context/LanguageContext";

export default function HowItWorksPage() {
  const { t } = useTranslation();

  const steps = [
    {
      num: "01",
      title: t("howItWorksPage.step1Title"),
      desc: t("howItWorksPage.step1Desc"),
      points: [
        t("howItWorksPage.step1p1"),
        t("howItWorksPage.step1p2"),
        t("howItWorksPage.step1p3"),
      ],
    },
    {
      num: "02",
      title: t("howItWorksPage.step2Title"),
      desc: t("howItWorksPage.step2Desc"),
      points: [
        t("howItWorksPage.step2p1"),
        t("howItWorksPage.step2p2"),
        t("howItWorksPage.step2p3"),
      ],
    },
    {
      num: "03",
      title: t("howItWorksPage.step3Title"),
      desc: t("howItWorksPage.step3Desc"),
      points: [
        t("howItWorksPage.step3p1"),
        t("howItWorksPage.step3p2"),
        t("howItWorksPage.step3p3"),
      ],
    },
    {
      num: "04",
      title: t("howItWorksPage.step4Title"),
      desc: t("howItWorksPage.step4Desc"),
      points: [
        t("howItWorksPage.step4p1"),
        t("howItWorksPage.step4p2"),
        t("howItWorksPage.step4p3"),
      ],
    },
    {
      num: "05",
      title: t("howItWorksPage.step5Title"),
      desc: t("howItWorksPage.step5Desc"),
      points: [
        t("howItWorksPage.step5p1"),
        t("howItWorksPage.step5p2"),
        t("howItWorksPage.step5p3"),
      ],
    },
    {
      num: "06",
      title: t("howItWorksPage.step6Title"),
      desc: t("howItWorksPage.step6Desc"),
      points: [
        t("howItWorksPage.step6p1"),
        t("howItWorksPage.step6p2"),
        t("howItWorksPage.step6p3"),
      ],
    },
    {
      num: "07",
      title: t("howItWorksPage.step7Title"),
      desc: t("howItWorksPage.step7Desc"),
      points: [
        t("howItWorksPage.step7p1"),
        t("howItWorksPage.step7p2"),
        t("howItWorksPage.step7p3"),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col selection:bg-[#1F5E91] selection:text-white">
      <PublicNavbar />

      {/* Breadcrumb / Top Bar */}
      <div className="bg-white border-b border-[#E9E9E9] py-4">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#667085]">
            <Link href="/" className="hover:text-[#1F5E91]">{t("howItWorksPage.breadcrumbHome")}</Link>
            <span>/</span>
            <span className="font-bold text-[#1F2933]">{t("howItWorksPage.breadcrumbSection")}</span>
            <span>/</span>
            <span className="font-bold text-[#1F5E91]">{t("howItWorksPage.breadcrumbCurrent")}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#123B5D]">
            <Shield className="h-4 w-4 text-[#F39A32]" />
            <span>{t("howItWorksPage.slaStandard")}</span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1F5E91]/20 bg-white px-3.5 py-1 text-xs font-bold text-[#1F5E91] mb-4 shadow-sm">
            <Cpu className="h-3.5 w-3.5 text-[#F39A32]" />
            <span>{t("howItWorksPage.pipelineBadge")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#123B5D] tracking-tight">
            {t("howItWorksPage.title")}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#667085] leading-relaxed">
            {t("howItWorksPage.subtitle")}
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((st) => (
            <div
              key={st.num}
              className="rounded-2xl border border-[#E9E9E9] bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#123B5D] text-white font-black text-base border-2 border-[#1F5E91] shadow-sm">
                {st.num}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#123B5D]">{st.title}</h3>
                <p className="text-xs sm:text-sm text-[#667085] mt-1.5 leading-relaxed">
                  {st.desc}
                </p>
                <div className="mt-4 pt-4 border-t border-[#E9E9E9] flex flex-wrap gap-2">
                  {st.points.map((pt, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5F4F0] px-3 py-1 text-[11px] font-semibold text-[#1F2933] border border-[#E9E9E9]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#1F5E91]" />
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-2xl bg-[#123B5D] text-white p-8 sm:p-10 text-center space-y-4 shadow-xl border-t-4 border-[#F39A32]">
          <h2 className="text-2xl font-black text-white">{t("howItWorksPage.ctaTitle")}</h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto leading-relaxed">
            {t("howItWorksPage.ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              href="/report"
              className="rounded-xl bg-[#F39A32] hover:bg-[#e08922] px-6 py-3 text-xs font-black text-[#123B5D] transition shadow active:scale-95"
            >
              {t("howItWorksPage.ctaReport")}
            </Link>
            <Link
              href="/track"
              className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-6 py-3 text-xs font-bold text-white transition active:scale-95"
            >
              {t("howItWorksPage.ctaTrack")}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
