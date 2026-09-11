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
  Send,
  Copy,
  Check,
  Building2,
} from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import Footer from "../../components/layout/Footer";
import { submitComplaint, analyzeTextLive } from "../../lib/api";
import { useTranslation } from "../../context/LanguageContext";
import LocationPicker from "../../components/location/LocationPicker";

export default function ReportPage() {
  const router = useRouter();
  const { t, language } = useTranslation();

  // Form state
  const [rawText, setRawText] = useState("");
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);

  // AI & Submission state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiPreview, setAiPreview] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

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
      setErrorMessage(t("reportPage.errorRequired") || "Please describe your civic complaint before submitting.");
      return;
    }

    if (!locationName.trim()) {
      setErrorMessage(t("reportPage.errorLocationRequired") || "Please provide or select a location in Pune for your grievance.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await submitComplaint({
        raw_text: rawText,
        preferred_language: language,
        location_name: locationName.trim() || undefined,
        latitude: latitude,
        longitude: longitude,
        client_timestamp: new Date().toISOString(),
      });
      setSubmitSuccess(result);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col selection:bg-[#1F5E91] selection:text-white">
      <PublicNavbar />

      {/* Page Breadcrumb / Header */}
      <div className="bg-white border-b border-[#E9E9E9] py-4">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#667085]">
            <Link href="/" className="hover:text-[#1F5E91]">{t("reportPage.breadcrumbHome")}</Link>
            <span>/</span>
            <span className="font-bold text-[#1F2933]">{t("reportPage.breadcrumbServices")}</span>
            <span>/</span>
            <span className="font-bold text-[#1F5E91]">{t("reportPage.breadcrumbCurrent")}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#123B5D]">
            <Building2 className="h-4 w-4 text-[#F39A32]" />
            <span>{t("reportPage.govMandate")}</span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* If submitted successfully, show confirmation screen */}
        {submitSuccess ? (
          <div className="rounded-2xl border border-[#E9E9E9] bg-white p-8 sm:p-12 shadow-md text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mb-6 shadow-sm">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-black text-emerald-800 border border-emerald-300 uppercase tracking-wider">
              {t("reportPage.successBadge")}
            </span>

            <h1 className="mt-4 text-3xl font-black text-[#123B5D] tracking-tight">
              {t("reportPage.successTitle")}
            </h1>

            <p className="mt-2 text-sm text-[#667085] max-w-lg mx-auto">
              {t("reportPage.successSubtitle")}
            </p>

            {/* Official Tracking ID Card */}
            <div className="mt-8 rounded-2xl bg-[#123B5D] text-white p-6 max-w-md mx-auto shadow-lg text-left border-2 border-[#1F5E91]">
              <div className="flex items-center justify-between text-[11px] font-bold text-white/70 uppercase tracking-widest">
                <span>{t("reportPage.trackingCardTitle")}</span>
                <span className="text-[#F39A32]">{t("reportPage.trackingCardSave")}</span>
              </div>

              <div className="mt-2 flex items-center justify-between bg-white/10 p-3 rounded-xl border border-white/10">
                <span className="text-xl sm:text-2xl font-mono font-black text-[#F39A32] tracking-wider select-all">
                  {submitSuccess.tracking_number}
                </span>
                <button
                  onClick={() => copyToClipboard(submitSuccess.tracking_number)}
                  className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition active:scale-95"
                  title="Copy Tracking Number"
                >
                  {copiedTracking ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-white/15 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-white/60 block text-[10px] uppercase font-bold">{t("reportPage.initialStatus")}</span>
                  <span className="font-semibold text-emerald-400 mt-0.5 block">
                    {submitSuccess.status}
                  </span>
                </div>
                <div>
                  <span className="text-white/60 block text-[10px] uppercase font-bold">{t("reportPage.assignedDepartment")}</span>
                  <span className="font-semibold text-cyan-300 mt-0.5 block truncate">
                    {submitSuccess.ai_preview?.department?.replace("_", " ") || "Municipal Dept"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={`/track?id=${submitSuccess.tracking_number}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F5E91] hover:bg-[#123B5D] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98]"
              >
                <span>{t("reportPage.trackOnlineButton")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => {
                  setSubmitSuccess(null);
                  setRawText("");
                  setLocationName("");
                  setLatitude(undefined);
                  setLongitude(undefined);
                  setAiPreview(null);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E9E9E9] bg-white hover:bg-[#F5F4F0] px-6 py-3.5 text-sm font-bold text-[#1F2933] transition"
              >
                {t("reportPage.submitAnotherButton")}
              </button>
            </div>
          </div>
        ) : (
          /* Intake Form */
          <div className="rounded-2xl border border-[#E9E9E9] bg-white p-6 sm:p-10 shadow-sm">
            {/* Form Top Banner */}
            <div className="flex items-center gap-4 border-b border-[#E9E9E9] pb-6 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#123B5D] text-white shadow-md border-2 border-[#1F5E91]">
                <FileText className="h-6 w-6 text-[#F39A32]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#123B5D] tracking-tight">
                  {t("reportPage.formTitle")}
                </h1>
                <p className="text-xs text-[#667085] mt-0.5">
                  {t("reportPage.formSubtitle")}
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
              {/* Main Grievance Narrative */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1F2933] flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-[#1F5E91]" />
                    {t("reportPage.describeLabel")} <span className="text-rose-500">{t("reportPage.describeRequired")}</span>
                  </label>
                  <button
                    type="button"
                    onClick={handlePreAnalyze}
                    disabled={isAnalyzing || rawText.trim().length < 5}
                    className="text-xs font-bold text-[#1F5E91] hover:text-[#123B5D] disabled:opacity-40 inline-flex items-center gap-1"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#F39A32]" />
                    <span>{isAnalyzing ? t("reportPage.analyzing") : t("reportPage.instantCheck")}</span>
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
                  placeholder={t("reportPage.textareaPlaceholder")}
                  className="w-full rounded-xl border border-[#E9E9E9] p-4 text-xs sm:text-sm text-[#1F2933] placeholder-[#667085] focus:border-[#1F5E91] focus:outline-none focus:ring-1 focus:ring-[#1F5E91] bg-white leading-relaxed"
                />
              </div>

              {/* Instant AI Preview Card */}
              {aiPreview && (
                <div className="rounded-xl border border-[#1F5E91]/30 bg-[#1F5E91]/5 p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-[#1F5E91]/20 pb-2 mb-3">
                    <span className="text-xs font-bold text-[#123B5D] flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-[#F39A32]" /> {t("reportPage.previewTitle")}
                    </span>
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#E9E9E9] text-[#1F5E91] font-bold">
                      {aiPreview.provider}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[#667085] block text-[10px] uppercase font-bold">{t("reportPage.fieldCategory")}</span>
                      <span className="font-semibold text-[#1F2933]">{aiPreview.summary}</span>
                    </div>
                    <div>
                      <span className="text-[#667085] block text-[10px] uppercase font-bold">{t("reportPage.fieldDepartment")}</span>
                      <span className="font-bold text-[#1F5E91]">
                        {aiPreview.department.replace("_", " ")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#667085] block text-[10px] uppercase font-bold">{t("reportPage.fieldPriority")}</span>
                      <span className="font-black text-[#F39A32]">{aiPreview.priority}</span>
                    </div>
                    <div>
                      <span className="text-[#667085] block text-[10px] uppercase font-bold">{t("reportPage.fieldDuration")}</span>
                      <span className="font-semibold text-[#1F2933]">{aiPreview.extracted_duration || "N/A"}</span>
                    </div>
                  </div>

                  {/* Clarification prompt if missing location */}
                  {aiPreview.missing_fields?.includes("location") && (
                    <div className="mt-3 pt-3 border-t border-[#1F5E91]/10 flex items-start gap-2 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">{t("reportPage.missingLocationTitle")} </span>
                        {aiPreview.clarification_questions?.[0] || t("reportPage.missingLocationDefault")}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Location Field with Interactive Leaflet Map & GPS Geolocation */}
              <LocationPicker
                value={locationName}
                latitude={latitude}
                longitude={longitude}
                required={true}
                onChange={(address, lat, lng) => {
                  setLocationName(address);
                  setLatitude(lat);
                  setLongitude(lng);
                }}
              />
              {/* Submit Button */}
              <div className="pt-4 border-t border-[#E9E9E9] flex items-center justify-between">
                <Link
                  href="/"
                  className="text-xs font-bold text-[#667085] hover:text-[#1F2933]"
                >
                  {t("reportPage.cancelButton")}
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting || !rawText.trim() || !locationName.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1F5E91] hover:bg-[#123B5D] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow hover:shadow-md disabled:opacity-50 transition active:scale-95"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? t("reportPage.submittingButton") : t("reportPage.submitButton")}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
