"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import Sidebar from "@/components/Sidebar";
import MobileSidebar from "@/components/MobileSidebar";

export default function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--fg)]">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 md:ml-[280px]">
        <div className="md:hidden sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                aria-label="Open navigation"
                onClick={() => setMobileOpen(true)}
                className="px-3 py-2 rounded-md border border-[var(--border)] hover:bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] transition"
              >
                <i className="fas fa-bars" />
              </button>
              <h1 className="text-lg font-bold bg-gradient-to-r from-[var(--fg)] to-[var(--secondary)] bg-clip-text text-transparent">
                Code Tutor AI
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] transition"
              >
                <i className={`fas ${theme === "dark" ? "fa-moon" : "fa-sun"}`} />
                <span className="hidden min-[550px]:inline text-sm">{theme === "dark" ? "Dark" : "Light"} Mode</span>
              </button>
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] transition"
              >
                <i className="fas fa-user" />
                <span className="hidden min-[550px]:inline text-sm">Settings</span>
              </Link>
            </div>
          </div>
        </div>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
} 