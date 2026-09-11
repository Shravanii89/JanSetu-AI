"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Clock,
  Send,
  RefreshCw,
  User,
  Phone,
  Mail,
  Camera,
  Globe,
} from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import { submitComplaint, analyzeTextLive } from "../../lib/api";

export default function ReportPage() {
  const router = useRouter();

  // Form state
  const [rawText, setRawText] = useState("");
  const [language, setLanguage] = useState("en");
  const [locationName, setLocationName] = useState("");
  const [citizenName, setCitizenName] = useState("");
  const [citizenPhone, setCitizenPhone] = useState("");
  const [citizenEmail, setCitizenEmail] = useState("");

  // AI & Submission state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiPreview, setAiPreview] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Instant AI check
  const handlePreAnalyze = async () => {
    if (!rawText.trim() || rawText.trim().length < 5) return;
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const res = await analyzeTextLive(rawText, language);
      setAiPreview(res);
      if (res.extracted_location && !locationName) {
        setLocationName(res.extracted_location);
      }
    } catch (err: any) {
      console.error("AI triage error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      setErrorMessage("Please describe your civic complaint before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await submitComplaint({
        raw_text: rawText,
        preferred_language: language,
        location_name: locationName.trim() || undefined,
        citizen_name: citizenName.trim() || undefined,
        citizen_phone: citizenPhone.trim() || undefined,
        citizen_email: citizenEmail.trim() || undefined,
      });
      setSubmitSuccess(result);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* If submitted successfully, show confirmation screen */}
        {submitSuccess ? (
          <div className="rounded-2xl border border-emerald-200 bg-white p-8 sm:p-12 shadow-xl text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 uppercase tracking-wider">
              Ticket Generated Successfully
            </span>

            <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
              Grievance Registered
            </h1>

            <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
              Your issue has been analyzed by JanSetu AI and routed directly to the responsible Pune Municipal Corporation department.
            </p>

            {/* Tracking ID Card */}
            <div className="mt-8 rounded-xl bg-slate-900 text-white p-6 max-w-md mx-auto shadow-inner text-left">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Official Tracking Number
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-amber-400 mt-1 tracking-wider select-all">
                {submitSuccess.tracking_number}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Initial Status</span>
                  <span className="font-semibold text-emerald-300">
                    {submitSuccess.status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Dept</span>
                  <span className="font-semibold text-indigo-300">
                    {submitSuccess.ai_preview?.department?.replace("_", " ") || "Municipal Dept"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={`/track?id=${submitSuccess.tracking_number}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow hover:bg-indigo-500 transition"
              >
                <span>Track Complaint Online</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => {
                  setSubmitSuccess(null);
                  setRawText("");
                  setLocationName("");
                  setAiPreview(null);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Submit Another Grievance
              </button>
            </div>
          </div>
        ) : (
          /* Intake Form */
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Report a Civic Complaint
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Describe your problem in plain language. AI handles categorization, priority & department routing.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Language Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
                  <Globe className="h-4 w-4 text-indigo-600" />
                  Preferred Language (Optional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { code: "en", label: "English" },
                    { code: "hi", label: "हिंदी (Hindi)" },
                    { code: "mr", label: "मराठी (Marathi)" },
                    { code: "hinglish", label: "Hinglish" },
                  ].map((lang) => (
                    <button
                      type="button"
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition text-center ${
                        language === lang.code
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Grievance Narrative */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    Describe the Civic Issue <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handlePreAnalyze}
                    disabled={isAnalyzing || rawText.trim().length < 5}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-40 inline-flex items-center gap-1"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>{isAnalyzing ? "Analyzing..." : "Instant AI Check"}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  required
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  onBlur={() => {
                    if (rawText.length > 10 && !aiPreview) {
                      handlePreAnalyze();
                    }
                  }}
                  placeholder="Example: There has been no water supply in our area for three days and nobody is responding. (You may also type in Marathi or Hindi)"
                  className="w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Instant AI Preview Card */}
              {aiPreview && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-2 mb-3">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-indigo-600" /> AI Understanding & Routing Preview
                    </span>
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-700">
                      {aiPreview.provider}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Category</span>
                      <span className="font-semibold text-slate-900">{aiPreview.summary}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Department</span>
                      <span className="font-semibold text-indigo-700">
                        {aiPreview.department.replace("_", " ")}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Priority</span>
                      <span className="font-bold text-amber-700">{aiPreview.priority}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Duration</span>
                      <span className="font-semibold text-slate-800">{aiPreview.extracted_duration || "N/A"}</span>
                    </div>
                  </div>

                  {/* Clarification prompt if missing location */}
                  {aiPreview.missing_fields?.includes("location") && (
                    <div className="mt-3 pt-3 border-t border-indigo-100 flex items-start gap-2 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Missing Location Detected: </span>
                        {aiPreview.clarification_questions?.[0] || "Please specify your area or landmark below so crews can locate it."}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Location Field */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                  Area / Landmark / Location in Pune
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Baner Road near Balewadi Phata, or Kothrud near Karve Statue"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Citizen Contact Information (Optional) */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Citizen Contact Details (For SMS & Resolution Updates)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Your Full Name</label>
                    <div className="relative">
                      <User className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        value={citizenName}
                        onChange={(e) => setCitizenName(e.target.value)}
                        placeholder="e.g. Anand Deshmukh"
                        className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Mobile Number</label>
                    <div className="relative">
                      <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="tel"
                        value={citizenPhone}
                        onChange={(e) => setCitizenPhone(e.target.value)}
                        placeholder="e.g. 9822012345"
                        className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="email"
                        value={citizenEmail}
                        onChange={(e) => setCitizenEmail(e.target.value)}
                        placeholder="e.g. citizen@gmail.com"
                        className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/"
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting || !rawText.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 disabled:opacity-50 transition"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? "Registering Grievance..." : "Submit Grievance to PMC"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
