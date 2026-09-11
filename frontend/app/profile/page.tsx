"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  Star,
  Award,
  CheckCircle2,
  Lock,
  Edit3,
  Save,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import Footer from "../../components/layout/Footer";
import { useAuth } from "../../hooks/useAuth";
import {
  getUserBadges,
  getUserContributions,
  updateUserProfile,
} from "../../lib/api";
import { BadgeItem, ContributionRecord } from "../../types/auth";
import { formatDateIST } from "../../lib/date";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading, refreshProfile } = useAuth();

  // Profile Edit State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [ward, setWard] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("English");

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Badges & Contributions
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [contributions, setContributions] = useState<ContributionRecord[]>([]);
  const [isLoadingExtras, setIsLoadingExtras] = useState(true);

  // Authentication gate
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // Populate form with user details
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setWard(user.ward || "");
      setPreferredLanguage(user.preferred_language || "English");
    }
  }, [user]);

  // Fetch badges and contributions
  useEffect(() => {
    if (isAuthenticated) {
      const loadExtras = async () => {
        setIsLoadingExtras(true);
        try {
          const [badgeData, contribData] = await Promise.all([
            getUserBadges(),
            getUserContributions(),
          ]);
          setBadges(badgeData?.badges || []);
          setContributions(contribData || []);
        } catch (err: any) {
          console.error("Failed to load profile badges/contributions:", err);
        } finally {
          setIsLoadingExtras(false);
        }
      };
      loadExtras();
    }
  }, [isAuthenticated]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaveSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMessage("Full name cannot be empty.");
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile({
        full_name: fullName.trim(),
        phone: cleanPhone,
        address: address.trim() || undefined,
        ward: ward.trim() || undefined,
        preferred_language: preferredLanguage,
      });

      await refreshProfile();
      setSaveSuccessMsg("Your profile information has been saved successfully.");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading || (!isAuthenticated && !user)) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] flex flex-col">
        <PublicNavbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-[#1F5E91] font-semibold text-sm">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading citizen profile...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col selection:bg-[#1F5E91] selection:text-white">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#667085]">
          <Link href="/dashboard" className="hover:text-[#1F5E91] flex items-center gap-1">
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <span>/</span>
          <span className="text-[#123B5D]">Citizen Profile & Recognition</span>
        </div>

        {/* Top Header */}
        <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-[#1F5E91] text-white flex items-center justify-center text-2xl font-black shadow-sm">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "C"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#123B5D]">
                    {user?.full_name || "Citizen Account"}
                  </h1>
                  {user?.is_verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#667085] mt-0.5">
                  {user?.email} • {user?.phone || "Phone not set"}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#1F5E91] font-semibold">
                  <Shield className="h-3.5 w-3.5" />
                  <span>JanSetu Citizen Redressal ID: #{user?.id ? user.id.slice(0, 8) : "CITIZEN"}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="bg-[#F5F4F0] border border-[#E9E9E9] rounded-xl px-4 py-2.5 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-600">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="text-xl font-black text-[#123B5D]">
                    {user?.civic_credits ?? 0}
                  </span>
                </div>
                <div className="text-[10px] uppercase font-bold text-[#667085] tracking-wider">
                  Civic Credits
                </div>
              </div>

              <div className="bg-[#F5F4F0] border border-[#E9E9E9] rounded-xl px-4 py-2.5 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-600">
                  <Award className="h-4 w-4 text-emerald-600" />
                  <span className="text-xl font-black text-[#123B5D]">
                    {user?.badges_count ?? 0}
                  </span>
                </div>
                <div className="text-[10px] uppercase font-bold text-[#667085] tracking-wider">
                  Badges Earned
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Profile Details + Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Personal Information Form (1/3) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-[#E9E9E9] mb-5">
                <Edit3 className="h-4 w-4 text-[#1F5E91]" />
                <h2 className="text-base font-bold text-[#123B5D]">Personal Information</h2>
              </div>

              {saveSuccessMsg && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-[#E9E9E9] px-3 py-2 text-xs sm:text-sm text-[#1F2933] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full rounded-xl border border-[#E9E9E9] px-3 py-2 text-xs sm:text-sm text-[#667085] bg-[#F5F4F0] font-medium cursor-not-allowed"
                  />
                  <span className="text-[10px] text-[#667085] mt-0.5 block">Email address cannot be changed</span>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#E9E9E9] px-3 py-2 text-xs sm:text-sm text-[#1F2933] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                    Ward / Prabhag
                  </label>
                  <input
                    type="text"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="e.g. Ward 12 - Shivajinagar"
                    className="w-full rounded-xl border border-[#E9E9E9] px-3 py-2 text-xs sm:text-sm text-[#1F2933] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                    Preferred Language
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full rounded-xl border border-[#E9E9E9] px-3 py-2 text-xs sm:text-sm text-[#1F2933] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] font-medium"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिंदी (Hindi)</option>
                    <option value="Marathi">मराठी (Marathi)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] block mb-1">
                    Residential Address
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Residential address"
                    className="w-full rounded-xl border border-[#E9E9E9] px-3 py-2 text-xs sm:text-sm text-[#1F2933] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] font-medium"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F5E91] hover:bg-[#123B5D] px-4 py-2.5 text-xs font-bold text-white shadow disabled:opacity-50 transition active:scale-95 cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{isSaving ? "Saving Updates..." : "Save Profile Details"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Badges & Contribution Timeline (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Civic Badges Showcase */}
            <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9E9E9]">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                  <div>
                    <h2 className="text-base font-bold text-[#123B5D]">Civic Honor Badges</h2>
                    <p className="text-xs text-[#667085]">
                      Earn special recognitions by participating in Pune&apos;s civic upkeep.
                    </p>
                  </div>
                </div>
                <div className="text-xs font-bold text-[#1F5E91] bg-[#1F5E91]/10 px-3 py-1 rounded-full border border-[#1F5E91]/20">
                  {badges.filter((b) => b.is_unlocked).length} / {badges.length || 6} Unlocked
                </div>
              </div>

              {isLoadingExtras ? (
                <div className="py-8 flex justify-center text-xs text-[#667085] gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-[#1F5E91]" />
                  <span>Loading badge achievements...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {badges.map((badge) => {
                    return (
                      <div
                        key={badge.id}
                        className={`rounded-xl p-4 border transition flex flex-col justify-between ${
                          badge.is_unlocked
                            ? "border-amber-300 bg-amber-50/40 shadow-xs"
                            : "border-[#E9E9E9] bg-[#F5F4F0]/50 opacity-70"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{badge.icon || "🏅"}</span>
                            {badge.is_unlocked ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="h-3 w-3 text-amber-600" />
                                Unlocked
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                                <Lock className="h-2.5 w-2.5" />
                                Locked
                              </span>
                            )}
                          </div>
                          <h3 className="text-xs font-bold text-[#123B5D]">{badge.name}</h3>
                          <p className="text-[11px] text-[#667085] mt-1 line-clamp-2">
                            {badge.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-[#E9E9E9]/60 text-[10px] text-[#667085]">
                          {badge.is_unlocked && badge.unlocked_at ? (
                            <span className="text-emerald-700 font-semibold">
                              Earned {formatDateIST(badge.unlocked_at)}
                            </span>
                          ) : (
                            <span>Req: {badge.requirement || "Submit grievances"}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Civic Credits Activity Feed */}
            <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9E9E9]">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                  <div>
                    <h2 className="text-base font-bold text-[#123B5D]">Civic Credits History</h2>
                    <p className="text-xs text-[#667085]">
                      Transparent server-verified ledger of your contributions.
                    </p>
                  </div>
                </div>
                <div className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  Total: {user?.civic_credits ?? 0} pts
                </div>
              </div>

              {isLoadingExtras ? (
                <div className="py-8 flex justify-center text-xs text-[#667085] gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-[#1F5E91]" />
                  <span>Loading contribution ledger...</span>
                </div>
              ) : contributions.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#667085] space-y-2">
                  <Sparkles className="h-6 w-6 text-amber-500 mx-auto" />
                  <p>No credit events recorded yet.</p>
                  <p className="text-[11px]">
                    Submit a verified grievance (+10 credits) or provide a clarification (+5 credits) to get started.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#E9E9E9] text-[11px] font-bold text-[#667085] uppercase tracking-wider bg-[#F5F4F0]/60">
                        <th className="py-2.5 px-3">Event Type</th>
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3">Credits</th>
                        <th className="py-2.5 px-3 text-right">Awarded At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9E9E9]">
                      {contributions.map((c) => (
                        <tr key={c.id} className="hover:bg-[#F5F4F0]/30 transition">
                          <td className="py-2.5 px-3 font-semibold text-[#123B5D] whitespace-nowrap">
                            <span className="bg-[#1F5E91]/10 text-[#1F5E91] px-2 py-0.5 rounded text-[10px] font-bold">
                              {c.event_type.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[#1F2933]">{c.description}</td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              +{c.credits} pts
                            </span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap text-right text-[#667085]">
                            {formatDateIST(c.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
