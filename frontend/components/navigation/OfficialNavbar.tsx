"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Bell, LogOut, User, Building2, ChevronDown } from "lucide-react";
import { clearToken } from "../../lib/auth";
import { getMe } from "../../lib/api";

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
        return <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">Municipal Admin</span>;
      case "COLLECTOR":
        return <span className="rounded-md bg-purple-600 px-2 py-0.5 text-xs font-semibold text-white">District Collector</span>;
      case "DEPARTMENT_OFFICER":
        return <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">Department Officer</span>;
      default:
        return <span className="rounded-md bg-slate-600 px-2 py-0.5 text-xs font-semibold text-white">{role}</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900 text-white shadow-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Portal Title */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white hidden sm:inline">
              JanSetu<span className="text-indigo-400">.AI</span>
            </span>
          </Link>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-sm font-medium text-slate-300 truncate">{title}</span>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200">{user.full_name}</span>
                <span className="text-[11px] text-slate-400">
                  {user.department_id ? user.department_id.replace("_", " ") : user.email}
                </span>
              </div>
              <div className="hidden sm:block">{getRoleBadge(user.role)}</div>
            </div>
          )}

          {/* Quick Exit to Public */}
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition hidden md:block"
          >
            Public Site
          </Link>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-rose-950 hover:text-rose-300 border border-slate-700 transition"
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
