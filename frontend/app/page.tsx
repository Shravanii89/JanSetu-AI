"use client";

import React from "react";
import PublicNavbar from "../components/navigation/PublicNavbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import AnnouncementBar from "../components/home/AnnouncementBar";
import ServiceStats from "../components/home/ServiceStats";
import Features from "../components/home/Features";
import HowItWorksSection from "../components/home/HowItWorksSection";
import CTASection from "../components/home/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col selection:bg-[#1F5E91] selection:text-white">
      {/* 1. Sticky Government Portal Header */}
      <PublicNavbar />

      {/* 2. Sewa Setu Inspired Hero Section with Citizens Background */}
      <Hero />

      {/* 3. Horizontal What's New Announcement Ticker */}
      <AnnouncementBar />

      {/* 4. Service Statistics Section (4 Cards) */}
      <ServiceStats />

      {/* 5. JanSetu AI Core Features Section */}
      <Features />

      {/* 6. Step-by-Step How It Works */}
      <HowItWorksSection />

      {/* 7. Call To Action Section */}
      <CTASection />

      {/* 8. Official Government Portal Footer */}
      <Footer />
    </div>
  );
}
