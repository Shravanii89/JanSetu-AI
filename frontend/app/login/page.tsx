"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Lock,
  Mail,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Building2,
  FileText,
  UserPlus,
} from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import Footer from "../../components/layout/Footer";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "../../context/LanguageContext";
import JanSetuLogo from "../../components/branding/JanSetuLogo";

const DEPARTMENT_OFFICERS = [
  {
    id: "WATER_SUPPLY",
    name: "Water Supply",
    email: "water.officer@jansetu.local",
    password: "officer123",
  },
  {
    id: "ELECTRICITY",
    name: "Electricity",
    email: "electricity.officer@jansetu.local",
    password: "officer123",
  },
  {
    id: "PUBLIC_HEALTH",
    name: "Public Health",
    email: "health.officer@jansetu.local",
    password: "officer123",
  },
  {
    id: "WASTE_MANAGEMENT",
    name: "Waste Management",
    email: "waste.officer@jansetu.local",
    password: "officer123",
  },
  {
    id: "PUBLIC_PROPERTY_MANAGEMENT",
    name: "Public Property Management",
    email: "property.officer@jansetu.local",
    password: "officer123",
  },
  {
    id: "GARDEN",
    name: "Garden",
    email: "garden.officer@jansetu.local",
    password: "officer123",
  },
  {
    id: "ROAD",
    name: "Road",
    email: "road.officer@jansetu.local",
    password: "officer123",
  },
  {
    id: "ENCROACHMENT",
    name: "Encroachment",
    email: "encroachment.officer@jansetu.local",
    password: "officer123",
  },
];

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "";
  const portalParam = searchParams.get("portal") || "";
  const isDraftNotice = searchParams.get("draft") === "true";

  const { t } = useTranslation();
  const { login } = useAuth();

  const isOfficialInitial =
    portalParam.toLowerCase() === "official" ||
    redirectParam.startsWith("/admin") ||
    redirectParam.startsWith("/department") ||
    redirectParam.startsWith("/collector");

  const [portalType, setPortalType] = useState<"CITIZEN" | "OFFICIAL">(
    isOfficialInitial ? "OFFICIAL" : "CITIZEN"
  );
  const [selectedDeptId, setSelectedDeptId] = useState("WATER_SUPPLY");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage(t("loginPage.errorRequired") || "Please enter your email/phone and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const user = await login(identifier.trim(), password.trim());

      // If redirect query param is present, prioritize it
      if (redirectParam) {
        router.push(redirectParam);
        return;
      }

      // Default routing based on role
      const role = user.role;
      if (role === "CITIZEN") {
        router.push("/dashboard");
      } else if (role === "MUNICIPAL_ADMIN") {
        router.push("/admin");
      } else if (role === "DEPARTMENT_OFFICER") {
        router.push("/department");
      } else if (role === "COLLECTOR") {
        router.push("/collector");
      } else {
        router.push("/track");
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "Invalid credentials. Please verify your email/phone and password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (email: string, pass: string, portal: "CITIZEN" | "OFFICIAL") => {
    setPortalType(portal);
    setIdentifier(email);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-md my-8">
      <div className="rounded-2xl border border-[#E9E9E9] bg-white p-8 shadow-md">
        {/* Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="mb-3">
            <JanSetuLogo variant="icon" size="lg" theme="light" />
          </div>
          <h1 className="text-2xl font-black text-[#123B5D] tracking-tight">
            JanSetu <span className="text-[#F39A32]">AI</span>
          </h1>
          <p className="text-xs text-[#667085] mt-0.5 font-semibold">
            {portalType === "OFFICIAL"
              ? "Official Government Access — Authorized Personnel"
              : "Civic Grievance Redressal & Citizen Empowerment"}
          </p>

          {/* Draft Notification Banner */}
          {isDraftNotice && (
            <div className="mt-3 w-full rounded-xl bg-amber-50 border border-amber-200 p-3 text-left flex items-start gap-2.5">
              <FileText className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900">Complaint Draft Saved</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Sign in or register below. Your draft report will be restored automatically.
                </p>
              </div>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-[#F5F4F0] rounded-xl w-full border border-[#E9E9E9]">
            <button
              type="button"
              onClick={() => {
                setPortalType("CITIZEN");
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                portalType === "CITIZEN"
                  ? "bg-white text-[#1F5E91] shadow-xs border border-[#E9E9E9]"
                  : "text-[#667085] hover:text-[#1F2933]"
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Citizen Login</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPortalType("OFFICIAL");
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                portalType === "OFFICIAL"
                  ? "bg-white text-[#123B5D] shadow-xs border border-[#E9E9E9]"
                  : "text-[#667085] hover:text-[#1F2933]"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Official Access</span>
            </button>
          </div>
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
              {portalType === "CITIZEN" ? "Citizen Email / Mobile" : "Official Email or Employee ID"}
            </label>
            <div className="relative">
              <Mail className="h-4 w-4 text-[#667085] absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  portalType === "CITIZEN"
                    ? "e.g. citizen@jansetu.demo or 9876543210"
                    : "e.g. admin@jansetu.demo or water.admin"
                }
                className="w-full rounded-xl border border-[#E9E9E9] pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1F2933] placeholder-[#667085] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] font-medium bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
              {t("loginPage.passwordLabel") || "Password"}
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 text-[#667085] absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#E9E9E9] pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1F2933] placeholder-[#667085] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] bg-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold text-white shadow hover:shadow-md disabled:opacity-50 transition active:scale-95 cursor-pointer ${
                portalType === "OFFICIAL"
                  ? "bg-[#123B5D] hover:bg-[#0D2B45]"
                  : "bg-[#1F5E91] hover:bg-[#123B5D]"
              }`}
            >
              <Shield className="h-4 w-4 text-[#F39A32]" />
              <span>
                {isLoading
                  ? "Authenticating..."
                  : portalType === "CITIZEN"
                  ? "Sign In as Citizen"
                  : "Sign In to Official Portal"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Citizen Registration Link - ONLY for Citizen Portal */}
        {portalType === "CITIZEN" && (
          <div className="mt-5 p-3 rounded-xl bg-[#F5F4F0] border border-[#E9E9E9] text-center">
            <p className="text-xs text-[#667085]">
              Don&apos;t have a citizen account?{" "}
              <Link
                href={`/register${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
                className="text-[#1F5E91] font-bold hover:underline inline-flex items-center gap-1 ml-1"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Create Citizen Account
              </Link>
            </p>
          </div>
        )}

        {/* Quick Fill Demo Accounts Panel */}
        <div className="mt-6 pt-5 border-t border-[#E9E9E9]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">
              {portalType === "CITIZEN" ? "Citizen Demo Accounts" : "Official Demo Accounts"}
            </span>
            <span className="text-[10px] text-[#1F5E91] font-bold bg-[#1F5E91]/10 px-2 py-0.5 rounded border border-[#1F5E91]/20">
              Click to prefill
            </span>
          </div>

          {portalType === "CITIZEN" ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemoAccount("citizen@jansetu.demo", "citizen123", "CITIZEN")}
                className="rounded-lg border border-[#E9E9E9] bg-[#F5F4F0] hover:bg-[#1F5E91] hover:text-white group p-2 text-left transition"
              >
                <span className="font-bold text-[#1F2933] group-hover:text-white block text-[11px]">
                  Demo Citizen
                </span>
                <span className="text-[10px] text-[#667085] group-hover:text-white/80 font-mono block truncate">
                  citizen@jansetu.demo
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount("citizen@jansetu.local", "citizen123", "CITIZEN")}
                className="rounded-lg border border-[#E9E9E9] bg-[#F5F4F0] hover:bg-[#1F5E91] hover:text-white group p-2 text-left transition"
              >
                <span className="font-bold text-[#1F2933] group-hover:text-white block text-[11px]">
                  Local Citizen
                </span>
                <span className="text-[10px] text-[#667085] group-hover:text-white/80 font-mono block truncate">
                  citizen@jansetu.local
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Top Row: Municipal Admin & District Collector */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillDemoAccount("admin@jansetu.local", "admin123", "OFFICIAL")}
                  className="rounded-lg border border-[#E9E9E9] bg-[#F5F4F0] hover:bg-[#1F5E91] hover:text-white group p-2 text-left transition"
                >
                  <span className="font-bold text-[#1F2933] group-hover:text-white block text-[11px]">
                    Municipal Admin
                  </span>
                  <span className="text-[10px] text-[#667085] group-hover:text-white/80 font-mono block truncate">
                    admin@jansetu.local
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemoAccount("collector@jansetu.demo", "collector123", "OFFICIAL")}
                  className="rounded-lg border border-[#E9E9E9] bg-[#F5F4F0] hover:bg-[#1F5E91] hover:text-white group p-2 text-left transition"
                >
                  <span className="font-bold text-[#1F2933] group-hover:text-white block text-[11px]">
                    District Collector
                  </span>
                  <span className="text-[10px] text-[#667085] group-hover:text-white/80 font-mono block truncate">
                    collector@jansetu.demo
                  </span>
                </button>
              </div>

              {/* Department Officer Selector */}
              <div className="rounded-lg border border-[#E9E9E9] bg-[#F5F4F0] p-2 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[#1F2933] text-[11px]">
                    Department Officer
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const dept = DEPARTMENT_OFFICERS.find((d) => d.id === selectedDeptId) || DEPARTMENT_OFFICERS[0];
                      fillDemoAccount(dept.email, dept.password, "OFFICIAL");
                    }}
                    className="text-[10px] font-bold text-[#1F5E91] hover:underline bg-white border border-[#E9E9E9] px-2 py-0.5 rounded shadow-xs"
                  >
                    Click to prefill
                  </button>
                </div>
                <select
                  value={selectedDeptId}
                  onChange={(e) => {
                    const newDeptId = e.target.value;
                    setSelectedDeptId(newDeptId);
                    const dept = DEPARTMENT_OFFICERS.find((d) => d.id === newDeptId);
                    if (dept) {
                      fillDemoAccount(dept.email, dept.password, "OFFICIAL");
                    }
                  }}
                  className="w-full rounded-md border border-[#E9E9E9] bg-white px-2 py-1.5 text-[11px] font-medium text-[#1F2933] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] cursor-pointer"
                >
                  {DEPARTMENT_OFFICERS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-[#667085]">
        <Link href="/" className="hover:text-[#1F5E91] font-semibold underline">
          Return to Citizen Home
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col selection:bg-[#1F5E91] selection:text-white">
      <PublicNavbar />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Suspense fallback={<div className="text-sm font-semibold text-[#667085]">Loading portal...</div>}>
          <LoginFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
