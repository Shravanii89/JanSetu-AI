"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, AlertTriangle, ArrowRight, CheckCircle2, Building2 } from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import { loginOfficial } from "../../lib/api";
import { setToken } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage("Please enter your official email or employee ID and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await loginOfficial(identifier.trim(), password.trim());
      setToken(data.access_token);

      // Backend determines the role and redirect destination!
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md mb-4">
                <Shield className="h-6 w-6 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Official Government Access
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Official Municipal Grievance & Resolution Portal
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Unified Login Form - ZERO role selector! */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Employee ID / Official Email
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. admin@jansetu.local or PMC-ENG-101"
                    className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 disabled:opacity-50 transition"
                >
                  <Shield className="h-4 w-4 text-amber-400" />
                  <span>{isLoading ? "Authenticating Official..." : "Sign In to Official Portal"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Development / Demo Quick Fill Accounts Panel */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Development Demo Accounts
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">
                  Click to pre-fill
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillDemoAccount("admin@jansetu.local", "admin123")}
                  className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 p-2 text-left transition"
                >
                  <span className="font-bold text-slate-800 block text-[11px]">Municipal Admin</span>
                  <span className="text-[10px] text-slate-500 font-mono block truncate">admin@jansetu.local</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemoAccount("water.officer@jansetu.local", "officer123")}
                  className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 p-2 text-left transition"
                >
                  <span className="font-bold text-slate-800 block text-[11px]">Water Officer</span>
                  <span className="text-[10px] text-slate-500 font-mono block truncate">water.officer@jansetu.local</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemoAccount("road.officer@jansetu.local", "officer123")}
                  className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 p-2 text-left transition"
                >
                  <span className="font-bold text-slate-800 block text-[11px]">Road Officer</span>
                  <span className="text-[10px] text-slate-500 font-mono block truncate">road.officer@jansetu.local</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemoAccount("collector@jansetu.local", "collector123")}
                  className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 p-2 text-left transition"
                >
                  <span className="font-bold text-slate-800 block text-[11px]">District Collector</span>
                  <span className="text-[10px] text-slate-500 font-mono block truncate">collector@jansetu.local</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800 underline">
              Return to Citizen Portal
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
