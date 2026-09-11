"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, User, Building2, ChevronDown } from "lucide-react";
import { clearToken } from "../../lib/auth";
import { getMe } from "../../lib/api";
import JanSetuLogo from "../branding/JanSetuLogo";

export const OfficialNavbar: React.FC<{ title?: string }> = ({ title = "Municipal Command Portal" }) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getMe()
      .then((data) => setUser(data))
      .catch(() => {
        // Not logged in or invalid token
        router.push("/login");
      });
  }, [router]);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "MUNICIPAL_ADMIN":
        return <span className="rounded-md bg-[#F39A32] px-2.5 py-0.5 text-xs font-black text-[#123B5D]">Municipal Admin</span>;
      case "COLLECTOR":
        return <span className="rounded-md bg-amber-500 px-2.5 py-0.5 text-xs font-black text-[#123B5D]">District Collector</span>;
      case "DEPARTMENT_OFFICER":
        return <span className="rounded-md bg-[#1F5E91] border border-white/20 px-2.5 py-0.5 text-xs font-bold text-white">Department Officer</span>;
      default:
        return <span className="rounded-md bg-white/10 border border-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">{role}</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E9E9E9] bg-[#123B5D] text-white shadow-sm">
      <div className="tricolor-stripe" />
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Portal Title */}
        <div className="flex items-center gap-3">
          <JanSetuLogo variant="full" size="sm" theme="dark" showTagline={false} showBadge={false} href="/" />
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="text-sm font-medium text-white/90 truncate">{title}</span>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-white">{user.full_name}</span>
                <span className="text-[11px] text-white/70">
                  {user.department_id ? user.department_id.replace("_", " ") : user.email}
                </span>
              </div>
              <div className="hidden sm:block">{getRoleBadge(user.role)}</div>
            </div>
          )}

          {/* Quick Exit to Public */}
          <Link
            href="/"
            className="text-xs font-bold text-white/80 hover:text-white bg-white/10 px-3 py-1.5 rounded-md border border-white/20 transition hidden md:block"
          >
            Public Site
          </Link>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-bold text-white/90 hover:bg-white/20 hover:text-white border border-white/20 transition"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default OfficialNavbar;
