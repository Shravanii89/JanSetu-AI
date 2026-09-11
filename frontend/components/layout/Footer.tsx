"use client";

import React from "react";
import Link from "next/link";
import { Shield, Phone, Mail, MapPin, ExternalLink, Globe, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#123B5D] text-white border-t-4 border-[#F39A32]">
      {/* Upper Footer: Main Links & Info */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1 & 2: Branding & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white border border-white/20 shadow-inner">
                <Shield className="h-6 w-6 text-[#F39A32]" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  JanSetu <span className="text-[#F39A32]">AI</span>
                </span>
                <p className="text-xs text-white/70 font-medium">
                  AI-Powered Citizen Service Platform
                </p>
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed max-w-md">
              JanSetu AI is an intelligent citizen service platform that bridges everyday citizen narratives with municipal operational workflows for Pune Municipal Corporation (PMC). It automatically structures, prioritizes, and routes complaints with deterministic SLAs.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-white/70">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Problem Statement PS02 • Government of Maharashtra</span>
            </div>

            <div className="pt-2 text-xs text-white/60 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#F39A32] shrink-0" />
                PMC Main Building, Shivajinagar, Pune - 411005
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#F39A32] shrink-0" />
                Citizen Helpline: 1800-1030-222 (Toll Free 24x7)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#F39A32] shrink-0" />
                Support: helpdesk@jansetu.pmc.gov.in
              </p>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/90 border-b border-white/10 pb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F39A32]"></span>
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <Link href="/" className="hover:text-[#F39A32] transition-colors flex items-center gap-1">
                  <span>Home Portal</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F39A32] transition-colors flex items-center gap-1">
                  <span>About JanSetu AI</span>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#F39A32] transition-colors flex items-center gap-1">
                  <span>How It Works</span>
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-[#F39A32] transition-colors flex items-center gap-1">
                  <span>Report an Issue</span>
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-[#F39A32] transition-colors flex items-center gap-1">
                  <span>Track Complaint Status</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#F39A32] text-[#F39A32]/90 font-semibold transition-colors flex items-center gap-1">
                  <span>Official Access Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/90 border-b border-white/10 pb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F39A32]"></span>
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <Link href="/report?dept=WATER_SUPPLY" className="hover:text-[#F39A32] transition-colors">
                  Water Supply Outages
                </Link>
              </li>
              <li>
                <Link href="/report?dept=ROAD" className="hover:text-[#F39A32] transition-colors">
                  Pothole & Road Repair
                </Link>
              </li>
              <li>
                <Link href="/report?dept=ELECTRICITY" className="hover:text-[#F39A32] transition-colors">
                  Street Light & Power
                </Link>
              </li>
              <li>
                <Link href="/report?dept=WASTE_MANAGEMENT" className="hover:text-[#F39A32] transition-colors">
                  Solid Waste & Sanitation
                </Link>
              </li>
              <li>
                <Link href="/report?dept=PUBLIC_HEALTH" className="hover:text-[#F39A32] transition-colors">
                  Public Health & Drainage
                </Link>
              </li>
              <li>
                <Link href="/report?dept=ENCROACHMENT" className="hover:text-[#F39A32] transition-colors">
                  Footpath & Encroachment
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Accessibility */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/90 border-b border-white/10 pb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F39A32]"></span>
              Governance & Policies
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Citizen Charter & SLA Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy & Data Security
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service & Usage
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Accessibility Compliance (GIGW)
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Hyperlinking Policy
                </span>
              </li>
            </ul>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-[11px] text-white/90 border border-white/10">
                <Globe className="h-3.5 w-3.5 text-[#F39A32]" />
                <span>Multilingual: EN | HI | MR</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tricolor divider */}
      <div className="tricolor-stripe" />

      {/* Bottom Bar: Copyright & Compliance */}
      <div className="bg-[#0b243a] py-5 text-xs text-white/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p>© 2026 JanSetu AI. All Rights Reserved.</p>
            <p className="text-[11px] text-white/50 mt-0.5">
              Developed for Pune Municipal Corporation (PMC) • Smart Governance Initiative
            </p>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-white/70">
            <span>Last Reviewed: 11 Sept 2026</span>
            <span>•</span>
            <Link href="/about" className="hover:text-white transition">About Portal</Link>
            <span>•</span>
            <Link href="/track" className="hover:text-white transition">Track Grievance</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-[#F39A32] transition">Official Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
