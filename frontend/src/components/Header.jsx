"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

export default function Header({ title }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="hidden md:flex flex-col md:flex-row gap-3 md:gap-0 md:items-center md:justify-between mb-6">
      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[var(--fg)] to-[var(--secondary)] bg-clip-text text-transparent">
        {title}
      </h1>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] transition"
        >
          <i className={`fas ${theme === "dark" ? "fa-moon" : "fa-sun"}`} />
          <span className="text-sm">{theme === "dark" ? "Dark" : "Light"} Mode</span>
        </button>
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] transition"
        >
          <i className="fas fa-user" />
          <span className="text-sm">Settings</span>
        </Link>
      </div>
    </header>
  );
} 