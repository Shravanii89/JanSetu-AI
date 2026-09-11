"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X, FileText, Search, Info, HelpCircle, Globe } from "lucide-react";

export const PublicNavbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Report Complaint", href: "/report" },
    { name: "Track Complaint", href: "/track" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
            <Shield className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">JanSetu<span className="text-indigo-600">.AI</span></span>
              <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 border border-indigo-200">
                PMC Civic
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">From Citizen Voice to Government Action</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isActive
                    ? "bg-slate-100 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 gap-1.5">
            <Globe className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-xs font-medium text-slate-700"
            >
              <option value="English">English</option>
              <option value="हिंदी">हिंदी (Hindi)</option>
              <option value="मराठी">मराठी (Marathi)</option>
            </select>
          </div>

          {/* Unified Official Access CTA */}
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800 transition-all"
          >
            <Shield className="h-3.5 w-3.5 text-amber-400" />
            <span>Official Access</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/login"
            className="flex items-center gap-1 rounded bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white"
          >
            <Shield className="h-3 w-3 text-amber-400" />
            <span>Official</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm font-semibold rounded-lg ${
                pathname === link.href ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-600">
            <span>Language:</span>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-slate-100 px-2 py-1 rounded border border-slate-200 text-xs font-medium"
            >
              <option value="English">English</option>
              <option value="हिंदी">हिंदी (Hindi)</option>
              <option value="मराठी">मराठी (Marathi)</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
