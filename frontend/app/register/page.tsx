"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Globe,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  FileText,
} from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import Footer from "../../components/layout/Footer";
import { useAuth } from "../../hooks/useAuth";
import JanSetuLogo from "../../components/branding/JanSetuLogo";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "";
  const isDraftNotice = searchParams.get("draft") === "true";

  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [ward, setWard] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("English");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Frontend validations
    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      setErrorMessage("Please provide a valid 10-digit mobile number.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        password,
        confirm_password: confirmPassword,
        address: address.trim() || undefined,
        ward: ward.trim() || undefined,
        preferred_language: preferredLanguage,
      });

      // Redirect upon registration
      if (redirectParam) {
        router.push(redirectParam);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "Registration failed. Please check your details and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl my-8">
      <div className="rounded-2xl border border-[#E9E9E9] bg-white p-8 shadow-md">
        {/* Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="mb-3">
            <JanSetuLogo variant="icon" size="lg" theme="light" />
          </div>
          <h1 className="text-2xl font-black text-[#123B5D] tracking-tight">
            Citizen Registration
          </h1>
          <p className="text-xs text-[#667085] mt-0.5 font-semibold">
            JanSetu AI Civic Grievance & Service Portal
          </p>

          {isDraftNotice && (
            <div className="mt-3 w-full rounded-xl bg-amber-50 border border-amber-200 p-3 text-left flex items-start gap-2.5">
              <FileText className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900">Complaint Draft Pending</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Complete registration to submit your grievance and earn your first civic credits!
                </p>
              </div>
            </div>
          )}

          {/* Civic Badge Benefit Pill */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Earn Civic Credits & Track Resolutions in Real Time</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Required Fields Section */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="h-4 w-4 text-[#667085] absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh K. Deshmukh"
                  className="w-full rounded-xl border border-[#E9E9E9] pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1F2933] placeholder-[#667085] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] font-medium bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-[#667085] absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-[#E9E9E9] pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1F2933] placeholder-[#667085] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] font-medium bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="h-4 w-4 text-[#667085] absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full rounded-xl border border-[#E9E9E9] pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1F2933] placeholder-[#667085] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] font-medium bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-[#667085] absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full rounded-xl border border-[#E9E9E9] pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1F2933] placeholder-[#667085] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-[#667085] absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full rounded-xl border border-[#E9E9E9] pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1F2933] placeholder-[#667085] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Optional Profile Details */}
          <div className="pt-2 border-t border-[#E9E9E9] space-y-4">
            <p className="text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              Locality & Language (Optional)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                  Ward / Prabhag
                </label>
                <div className="relative">
                  <MapPin className="h-4 w-4 text-[#667085] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="e.g. Ward 12 - Shivajinagar"
                    className="w-full rounded-xl border border-[#E9E9E9] pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1F2933] placeholder-[#667085] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] font-medium bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                  Preferred Language
                </label>
                <div className="relative">
                  <Globe className="h-4 w-4 text-[#667085] absolute left-3 top-3.5" />
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full rounded-xl border border-[#E9E9E9] pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1F2933] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] font-medium bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिंदी (Hindi)</option>
                    <option value="Marathi">मराठी (Marathi)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                Residential Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="e.g. Flat 304, Green Heights, Baner Road, Pune"
                className="w-full rounded-xl border border-[#E9E9E9] p-3 text-xs sm:text-sm text-[#1F2933] placeholder-[#667085] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] font-medium bg-white"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F5E91] hover:bg-[#123B5D] px-4 py-3 text-xs sm:text-sm font-bold text-white shadow hover:shadow-md disabled:opacity-50 transition active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-[#F39A32]" />
              <span>{isLoading ? "Creating Citizen Account..." : "Complete Registration"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E9E9E9] text-center">
          <p className="text-xs text-[#667085]">
            Already registered?{" "}
            <Link
              href={`/login${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
              className="text-[#1F5E91] font-bold hover:underline"
            >
              Sign in to your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col selection:bg-[#1F5E91] selection:text-white">
      <PublicNavbar />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Suspense fallback={<div className="text-sm font-semibold text-[#667085]">Loading registration...</div>}>
          <RegisterFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
