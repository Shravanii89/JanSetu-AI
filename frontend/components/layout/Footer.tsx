"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink, Globe, Heart } from "lucide-react";
import { useTranslation } from "../../context/LanguageContext";
import JanSetuLogo from "../branding/JanSetuLogo";

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#123B5D] text-white border-t-4 border-[#F39A32]">
      {/* Upper Footer: Main Links & Info */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-9 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Col 1 & 2: Branding & Description */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="flex items-center gap-3">
              <JanSetuLogo variant="icon" size="md" theme="dark" />
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  JanSetu <span className="text-[#F39A32]">AI</span>
                </span>
                <p className="text-xs text-white/70 font-medium">
                  {t("footer.tagline")}
                </p>
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed max-w-md">
              {t("footer.desc")}
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-white/70">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t("footer.statementBadge")}</span>
            </div>

            <div className="pt-1 text-xs text-white/60 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#F39A32] shrink-0" />
                {t("footer.address")}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#F39A32] shrink-0" />
                {t("footer.helplineText")}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#F39A32] shrink-0" />
                {t("footer.emailText")}
              </p>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/90 border-b border-white/10 pb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F39A32]"></span>
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-1.5 text-xs text-white/75">
              <li>
                <Link href="/" className="hover:text-[#F39A32] transition-colors flex items-center gap-1">
                  <span>{t("footer.linkHome")}</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F39A32] transition-colors flex items-center gap-1">
                  <span>{t("footer.linkAbout")}</span>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#F39A32] transition-colors flex items-center gap-1">
                  <span>{t("footer.linkHowItWorks")}</span>
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-[#F39A32] transition-colors flex items-center gap-1">
                  <span>{t("footer.linkReport")}</span>
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-[#F39A32] transition-colors flex items-center gap-1">
                  <span>{t("footer.linkTrack")}</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#F39A32] text-[#F39A32]/90 font-semibold transition-colors flex items-center gap-1">
                  <span>{t("footer.linkLogin")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Services */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/90 border-b border-white/10 pb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F39A32]"></span>
              {t("footer.citizenServices")}
            </h4>
            <ul className="space-y-1.5 text-xs text-white/75">
              <li>
                <Link href="/report?dept=WATER_SUPPLY" className="hover:text-[#F39A32] transition-colors">
                  {t("footer.serviceWater")}
                </Link>
              </li>
              <li>
                <Link href="/report?dept=ROAD" className="hover:text-[#F39A32] transition-colors">
                  {t("footer.serviceRoad")}
                </Link>
              </li>
              <li>
                <Link href="/report?dept=ELECTRICITY" className="hover:text-[#F39A32] transition-colors">
                  {t("footer.serviceLight")}
                </Link>
              </li>
              <li>
                <Link href="/report?dept=WASTE_MANAGEMENT" className="hover:text-[#F39A32] transition-colors">
                  {t("footer.serviceWaste")}
                </Link>
              </li>
              <li>
                <Link href="/report?dept=PUBLIC_HEALTH" className="hover:text-[#F39A32] transition-colors">
                  {t("footer.serviceHealth")}
                </Link>
              </li>
              <li>
                <Link href="/report?dept=ENCROACHMENT" className="hover:text-[#F39A32] transition-colors">
                  {t("footer.serviceEncroachment")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Accessibility */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/90 border-b border-white/10 pb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F39A32]"></span>
              {t("footer.governancePolicies")}
            </h4>
            <ul className="space-y-1.5 text-xs text-white/75">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  {t("footer.policyCharter")}
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  {t("footer.policyPrivacy")}
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  {t("footer.policyTerms")}
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  {t("footer.policyAccessibility")}
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  {t("footer.policyHyperlink")}
                </span>
              </li>
            </ul>

            <div className="pt-1.5">
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] text-white/90 border border-white/10">
                <Globe className="h-3.5 w-3.5 text-[#F39A32]" />
                <span>{t("footer.multilingualBadge")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tricolor divider */}
      <div className="tricolor-stripe" />

      {/* Bottom Bar: Copyright & Compliance */}
      <div className="bg-[#0b243a] py-3.5 text-xs text-white/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div>
            <p>{t("footer.copyright")}</p>
            <p className="text-[11px] text-white/50 mt-0.5">
              {t("footer.initiativeNote")}
            </p>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-white/70">
            <span>{t("footer.lastReviewed")}</span>
            <span>•</span>
            <Link href="/about" className="hover:text-white transition">{t("footer.linkAbout")}</Link>
            <span>•</span>
            <Link href="/track" className="hover:text-white transition">{t("footer.linkTrack")}</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-[#F39A32] transition">{t("footer.linkLogin")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
