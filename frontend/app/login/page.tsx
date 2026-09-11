"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, AlertTriangle, ArrowRight, CheckCircle2, Building2 } from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import Footer from "../../components/layout/Footer";
import { loginOfficial } from "../../lib/api";
import { setToken } from "../../lib/auth";
import { useTranslation } from "../../context/LanguageContext";
import JanSetuLogo from "../../components/branding/JanSetuLogo";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage(t("loginPage.errorRequired") || "Please enter your official email or employee ID and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await loginOfficial(identifier.trim(), password.trim());
      setToken(data.access_token);

      // Backend determines the role and redirect destination
      const userRole = data.user.role;
      if (userRole === "MUNICIPAL_ADMIN") {
        router.push("/admin");
      } else if (userRole === "DEPARTMENT_OFFICER") {
        router.push("/department");
      } else if (userRole === "COLLECTOR") {
        router.push("/collector");
      } else {
        router.push("/track");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid credentials. Please verify your official details.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (email: string, pass: string) => {
    setIdentifier(email);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col selection:bg-[#1F5E91] selection:text-white">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md my-8">
          <div className="rounded-2xl border border-[#E9E9E9] bg-white p-8 shadow-md">
            {/* Header */}
            <div className="text-center mb-8 flex flex-col items-center">
              <div className="mb-4">
                <JanSetuLogo variant="icon" size="lg" theme="light" />
              </div>
              <h1 className="text-2xl font-black text-[#123B5D] tracking-tight">
                JanSetu <span className="text-[#F39A32]">AI</span>
              </h1>
              <p className="text-xs text-[#667085] mt-0.5 font-semibold">
                AI-Powered Citizen Service Platform
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#1F5E91]/10 px-3 py-1 text-[11px] font-bold text-[#1F5E91] border border-[#1F5E91]/20">
                <span>{t("loginPage.title")}</span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1 font-medium">
                {t("loginPage.subtitle")}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Unified Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                  {t("loginPage.identifierLabel")}
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-[#667085] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={t("loginPage.identifierPlaceholder")}
                    className="w-full rounded-xl border border-[#E9E9E9] pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1F2933] placeholder-[#667085] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] font-medium bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                  {t("loginPage.passwordLabel")}
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-[#667085] absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("loginPage.passwordPlaceholder")}
                    className="w-full rounded-xl border border-[#E9E9E9] pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1F2933] placeholder-[#667085] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F5E91] hover:bg-[#123B5D] px-4 py-3 text-xs sm:text-sm font-bold text-white shadow hover:shadow-md disabled:opacity-50 transition active:scale-95"
                >
                  <Shield className="h-4 w-4 text-[#F39A32]" />
                  <span>{isLoading ? t("loginPage.authenticating") : t("loginPage.signInButton")}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Development / Demo Quick Fill Accounts Panel */}
            <div className="mt-8 pt-6 border-t border-[#E9E9E9]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">
                  {t("loginPage.demoAccountsTitle")}
                </span>
                <span className="text-[10px] text-[#1F5E91] font-bold bg-[#1F5E91]/10 px-2 py-0.5 rounded border border-[#1F5E91]/20">
                  {t("loginPage.clickToPrefill")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillDemoAccount("admin@jansetu.local", "admin123")}
                  className="rounded-lg border border-[#E9E9E9] bg-[#F5F4F0] hover:bg-[#1F5E91] hover:text-white group p-2 text-left transition"
                >
                  <span className="font-bold text-[#1F2933] group-hover:text-white block text-[11px]">{t("loginPage.roleAdmin")}</span>
                  <span className="text-[10px] text-[#667085] group-hover:text-white/80 font-mono block truncate">admin@jansetu.local</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemoAccount("water.officer@jansetu.local", "officer123")}
                  className="rounded-lg border border-[#E9E9E9] bg-[#F5F4F0] hover:bg-[#1F5E91] hover:text-white group p-2 text-left transition"
                >
                  <span className="font-bold text-[#1F2933] group-hover:text-white block text-[11px]">{t("loginPage.roleWater")}</span>
                  <span className="text-[10px] text-[#667085] group-hover:text-white/80 font-mono block truncate">water.officer@jansetu.local</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemoAccount("road.officer@jansetu.local", "officer123")}
                  className="rounded-lg border border-[#E9E9E9] bg-[#F5F4F0] hover:bg-[#1F5E91] hover:text-white group p-2 text-left transition"
                >
                  <span className="font-bold text-[#1F2933] group-hover:text-white block text-[11px]">{t("loginPage.roleRoad")}</span>
                  <span className="text-[10px] text-[#667085] group-hover:text-white/80 font-mono block truncate">road.officer@jansetu.local</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemoAccount("collector@jansetu.local", "collector123")}
                  className="rounded-lg border border-[#E9E9E9] bg-[#F5F4F0] hover:bg-[#1F5E91] hover:text-white group p-2 text-left transition"
                >
                  <span className="font-bold text-[#1F2933] group-hover:text-white block text-[11px]">{t("loginPage.roleCollector")}</span>
                  <span className="text-[10px] text-[#667085] group-hover:text-white/80 font-mono block truncate">collector@jansetu.local</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#667085]">
            <Link href="/" className="hover:text-[#1F5E91] font-semibold underline">
              {t("loginPage.returnHome")}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
