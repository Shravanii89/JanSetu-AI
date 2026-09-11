"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  Globe,
  FileText,
  Search,
  ChevronDown,
  Lock,
  User as UserIcon,
  LogOut,
  Star,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import { useTranslation } from "../../context/LanguageContext";
import { useTextSize } from "../../context/TextSizeContext";
import { useAuth } from "../../hooks/useAuth";
import JanSetuLogo from "../branding/JanSetuLogo";

export const PublicNavbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { textSize, setTextSize } = useTextSize();
  const { t, languageName, setLanguage } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.howItWorks"), href: "/how-it-works" },
    { name: t("nav.reportIssue"), href: "/report" },
    { name: t("nav.trackComplaint"), href: "/track" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      {/* 1. Indian Tricolor Accent Strip */}
      <div className="tricolor-stripe" />

      {/* 2. Top Government Utility Bar */}
      <div className="bg-[#123B5D] text-white text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-white/10 hidden sm:block">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          {/* Left: Official Government Identifier */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white/95 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F39A32]" />
              {t("nav.govName")}
            </span>
            <span className="text-white/40">|</span>
            <span className="text-white/80">{t("nav.pmcName")}</span>
            <span className="text-white/40">|</span>
            <span className="text-[#F39A32] font-semibold">{t("nav.portalTag")}</span>
          </div>

          {/* Right: Helpline & Accessibility Controls */}
          <div className="flex items-center gap-4">
            {/* Citizen Helpline */}
            <div className="flex items-center gap-1.5 text-white/90">
              <Phone className="h-3 w-3 text-[#F39A32]" />
              <span>{t("nav.helpline")} <strong className="text-white font-bold">{t("nav.helplineNumber")}</strong></span>
            </div>

            <span className="text-white/30">|</span>

            {/* Accessibility Font Size Toggle */}
            <div className="flex items-center gap-1 text-[10px] text-white/80">
              <span>{t("nav.textSize")}</span>
              <button
                type="button"
                onClick={() => setTextSize("small")}
                className={`px-1.5 py-0.5 rounded border border-white/20 hover:bg-white/10 transition active:scale-95 ${
                  textSize === "small" ? "bg-white/20 text-[#F39A32] font-bold" : ""
                }`}
                title="Decrease font size"
                aria-label="Decrease text size (A-)"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setTextSize("normal")}
                className={`px-1.5 py-0.5 rounded border border-white/20 hover:bg-white/10 transition active:scale-95 ${
                  textSize === "normal" ? "bg-white/20 text-[#F39A32] font-bold" : ""
                }`}
                title="Normal font size"
                aria-label="Default text size (A)"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setTextSize("large")}
                className={`px-1.5 py-0.5 rounded border border-white/20 hover:bg-white/10 transition active:scale-95 ${
                  textSize === "large" ? "bg-white/20 text-[#F39A32] font-bold" : ""
                }`}
                title="Increase font size"
                aria-label="Increase text size (A+)"
              >
                A+
              </button>
            </div>

            <span className="text-white/30">|</span>

            {/* Language Selector */}
            <div className="flex items-center gap-1 text-white/90">
              <Globe className="h-3 w-3 text-[#F39A32]" />
              <select
                value={languageName}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/10 text-white text-[11px] rounded px-1.5 py-0.5 outline-none border border-white/20 cursor-pointer font-medium"
              >
                <option value="English" className="bg-[#123B5D] text-white">English</option>
                <option value="हिंदी" className="bg-[#123B5D] text-white">हिंदी (Hindi)</option>
                <option value="मराठी" className="bg-[#123B5D] text-white">मराठी (Marathi)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Brand & Navigation Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <JanSetuLogo variant="icon" size="md" theme="light" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-[#123B5D]">
                  JanSetu <span className="text-[#F39A32]">AI</span>
                </span>
                <span className="hidden sm:inline-block rounded-md bg-[#1F5E91]/10 px-2 py-0.5 text-[10px] font-extrabold text-[#1F5E91] border border-[#1F5E91]/20 uppercase tracking-wide">
                  {t("nav.pmcPortalBadge")}
                </span>
              </div>
              <p className="text-[11px] text-[#667085] font-semibold tracking-tight">
                {t("nav.tagline")}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-bold rounded-lg transition-all ${
                    isActive
                      ? "bg-[#1F5E91] text-white shadow-sm"
                      : "text-[#1F2933] hover:text-[#1F5E91] hover:bg-[#F5F4F0]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Citizen Profile / Official Access / Login */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {user.role === "CITIZEN" ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#123B5D] bg-[#F5F4F0] hover:bg-[#E9E9E9] border border-[#E9E9E9] transition"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 text-[#1F5E91]" />
                      <span>{user.full_name || "Dashboard"}</span>
                    </Link>

                    <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-200/80 shadow-xs" title="Civic Credits">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      <span>{user.civic_credits ?? 0} pts</span>
                    </div>

                    <Link
                      href="/profile"
                      className="p-2 rounded-lg text-[#1F2933] hover:bg-[#F5F4F0] border border-[#E9E9E9] transition"
                      title="Citizen Profile"
                    >
                      <UserIcon className="h-4 w-4 text-[#1F5E91]" />
                    </Link>
                  </>
                ) : (
                  <Link
                    href={
                      user.role === "MUNICIPAL_ADMIN"
                        ? "/admin"
                        : user.role === "DEPARTMENT_OFFICER"
                        ? "/department"
                        : "/collector"
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#123B5D] hover:bg-[#1F5E91] transition"
                  >
                    <Shield className="h-3.5 w-3.5 text-[#F39A32]" />
                    <span>
                      {user.role === "MUNICIPAL_ADMIN"
                        ? "Admin Portal"
                        : user.role === "DEPARTMENT_OFFICER"
                        ? "Officer Portal"
                        : "Collector Portal"}
                    </span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => logout()}
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg font-bold border border-red-200 transition"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-lg bg-[#1F5E91] hover:bg-[#123B5D] text-white px-4 py-2.5 text-xs font-bold shadow-md hover:shadow-lg transition-all border border-[#1F5E91] active:scale-[0.98]"
              >
                <Lock className="h-3.5 w-3.5 text-[#F39A32]" />
                <span>{t("nav.loginRegister")}</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {isAuthenticated && user ? (
              <Link
                href={user.role === "CITIZEN" ? "/dashboard" : "/admin"}
                className="flex items-center gap-1 rounded-md bg-[#1F5E91] px-2.5 py-1.5 text-xs font-bold text-white"
              >
                <UserIcon className="h-3 w-3 text-[#F39A32]" />
                <span>{user.full_name?.split(" ")[0] || "Account"}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1 rounded-md bg-[#1F5E91] px-2.5 py-1.5 text-xs font-bold text-white"
              >
                <Lock className="h-3 w-3 text-[#F39A32]" />
                <span>{t("nav.loginRegister").split("/")[0].trim()}</span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1F2933] hover:bg-[#F5F4F0] border border-[#E9E9E9]"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E9E9E9] bg-white px-4 py-4 space-y-2 shadow-lg animate-in fade-in duration-200">
          {isAuthenticated && user && (
            <div className="p-3 mb-2 rounded-xl bg-[#F5F4F0] border border-[#E9E9E9]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#123B5D]">{user.full_name}</div>
                  <div className="text-[10px] text-[#667085] capitalize">{user.role.toLowerCase().replace('_', ' ')}</div>
                </div>
                {user.role === "CITIZEN" && (
                  <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[11px] font-bold">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span>{user.civic_credits ?? 0} pts</span>
                  </div>
                )}
              </div>
              <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-[#E9E9E9]">
                {user.role === "CITIZEN" ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-1.5 rounded-lg bg-[#1F5E91] text-white text-xs font-bold"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-1.5 rounded-lg bg-white border border-[#E9E9E9] text-[#1F2933] text-xs font-bold"
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <Link
                    href={user.role === "MUNICIPAL_ADMIN" ? "/admin" : user.role === "DEPARTMENT_OFFICER" ? "/department" : "/collector"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-1.5 rounded-lg bg-[#123B5D] text-white text-xs font-bold"
                  >
                    Official Portal
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1.5 text-xs text-red-600 font-bold hover:bg-red-50 rounded-lg border border-red-200"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 text-sm font-bold rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#1F5E91] text-white"
                    : "text-[#1F2933] hover:bg-[#F5F4F0] hover:text-[#1F5E91]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-[#E9E9E9] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#667085] px-1">
              <span>{t("nav.preferredLang")}</span>
              <select
                value={languageName}
                onChange={(e) => setSelectedLangFromSelect(e.target.value)}
                className="bg-[#F5F4F0] text-[#1F2933] px-2 py-1 rounded border border-[#E9E9E9] text-xs font-semibold"
              >
                <option value="English">English</option>
                <option value="हिंदी">हिंदी (Hindi)</option>
                <option value="मराठी">मराठी (Marathi)</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs text-[#667085] px-1">
              <span>{t("nav.textSize")}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setTextSize("small")}
                  className={`px-2 py-0.5 rounded border text-xs font-bold transition ${
                    textSize === "small"
                      ? "bg-[#1F5E91] text-white border-[#1F5E91]"
                      : "bg-[#F5F4F0] border-[#E9E9E9] text-[#1F2933] hover:bg-white"
                  }`}
                  aria-label="Decrease font size"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setTextSize("normal")}
                  className={`px-2 py-0.5 rounded border text-xs font-bold transition ${
                    textSize === "normal"
                      ? "bg-[#1F5E91] text-white border-[#1F5E91]"
                      : "bg-[#F5F4F0] border-[#E9E9E9] text-[#1F2933] hover:bg-white"
                  }`}
                  aria-label="Normal font size"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setTextSize("large")}
                  className={`px-2 py-0.5 rounded border text-xs font-bold transition ${
                    textSize === "large"
                      ? "bg-[#1F5E91] text-white border-[#1F5E91]"
                      : "bg-[#F5F4F0] border-[#E9E9E9] text-[#1F2933] hover:bg-white"
                  }`}
                  aria-label="Increase font size"
                >
                  A+
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#667085] px-1">
              <span>{t("nav.citizenHelpline")}</span>
              <span className="font-bold text-[#1F5E91]">{t("nav.helplineNumber")}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );

  function setSelectedLangFromSelect(val: string) {
    setLanguage(val);
  }
};

export default PublicNavbar;
