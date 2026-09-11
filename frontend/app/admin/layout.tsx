"use client";

// JanSetu AI - Municipal Admin Layout
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "../../context/LanguageContext";
import JanSetuLogo from "../../components/branding/JanSetuLogo";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col">
      <div className="tricolor-stripe" />
      <header className="border-b border-[#E9E9E9] bg-[#123B5D] text-white px-6 py-3.5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <JanSetuLogo variant="full" size="sm" theme="dark" showTagline={false} showBadge={false} href="/" />
          <span className="rounded-md bg-[#F39A32] px-2.5 py-0.5 text-xs font-black text-[#123B5D]">
            {t("officialLayout.adminRole")}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/70 hidden sm:inline">
            {t("officialLayout.officialAccessPmc")}
          </span>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white bg-white/10 px-3 py-1 rounded-md border border-white/20 transition"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>{t("officialLayout.citizenPortalLink")}</span>
          </Link>
        </div>
      </header>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
