"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ChevronLeft, ChevronRight, Bell, ArrowRight } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  const announcements = [
    "Report civic issues faster with AI-powered complaint classification and smart routing.",
    "Pune Municipal Corporation introduces 24x7 automated SLA tracking across all 8 operational departments.",
    "Submit complaints in Marathi, Hindi, or English — JanSetu AI automatically extracts issue and landmark details.",
    "Emergency P0 hazards (live wires, main pipeline bursts) are escalated within 15 minutes with high priority dispatch.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div className="border-y border-[#E9E9E9] bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: What's New Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 rounded-lg bg-[#F39A32] text-[#123B5D] px-3 py-1.5 text-xs font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="h-3.5 w-3.5 fill-[#123B5D]" />
              <span>WHAT&apos;S NEW</span>
            </div>
          </div>

          {/* Center: Rotating Announcement text */}
          <div className="flex-1 w-full overflow-hidden text-center sm:text-left">
            <p className="text-xs sm:text-sm font-semibold text-[#1F2933] truncate transition-opacity duration-300">
              {announcements[currentIndex]}
            </p>
          </div>

          {/* Right: Dots indicator, Prev/Next, and View More button */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Dots */}
            <div className="hidden md:flex items-center gap-1.5">
              {announcements.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIndex ? "w-5 bg-[#F39A32]" : "w-2 bg-[#E9E9E9] hover:bg-[#667085]"
                  }`}
                  aria-label={`Go to announcement ${i + 1}`}
                />
              ))}
            </div>

            {/* Prev/Next arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="p-1 rounded-md text-[#667085] hover:text-[#1F5E91] hover:bg-[#F5F4F0] transition"
                aria-label="Previous announcement"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1 rounded-md text-[#667085] hover:text-[#1F5E91] hover:bg-[#F5F4F0] transition"
                aria-label="Next announcement"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* View More button */}
            <Link
              href="/about"
              className="inline-flex items-center gap-1 rounded-lg border border-[#1F5E91] bg-white hover:bg-[#1F5E91] text-[#1F5E91] hover:text-white px-3 py-1 text-xs font-bold transition-colors"
            >
              <span>View More</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
