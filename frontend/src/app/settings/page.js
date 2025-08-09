"use client";

import AppShell from "@/components/AppShell";
import Header from "@/components/Header";
import { useTheme } from "@/components/ThemeProvider";
import { loadValue, removeValue, saveValue } from "@/lib/storage";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(loadValue("user_name", ""));
  }, []);

  function onSave() {
    saveValue("user_name", name);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function resetAll() {
    if (confirm("This will clear your local data (history, settings). Continue?")) {
      removeValue("history");
      removeValue("current_session_id");
      removeValue("user_name");
      // Leave theme as-is.
      alert("Data cleared.");
    }
  }

  return (
    <AppShell>
      <Header title="Settings" />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_85%,transparent)] p-3"
          />
          <p className="text-xs text-[var(--muted)] mt-1">Used to personalize the experience.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm">Theme</div>
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--card)] hover:bg-[color-mix(in_oklab,var(--primary)_8%,transparent)]"
          >
            <i className={`fas ${theme === "dark" ? "fa-moon" : "fa-sun"}`} />
            <span className="text-sm">{theme === "dark" ? "Dark" : "Light"}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onSave} className="inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white px-4 py-2">
            <i className="fas fa-save" /> Save
          </button>
          {saved && <span className="text-sm text-[var(--success)]">Saved</span>}
          <button onClick={resetAll} className="ml-auto inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-4 py-2">
            <i className="fas fa-trash" /> Reset Data
          </button>
        </div>
      </div>
    </AppShell>
  );
} 