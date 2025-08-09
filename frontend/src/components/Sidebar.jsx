"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "fa-home" },
  { href: "/history", label: "History", icon: "fa-history" },
  { href: "/tutorials", label: "Tutorials", icon: "fa-book" },
  { href: "/playground", label: "Playground", icon: "fa-code" },
  { href: "/settings", label: "Settings", icon: "fa-cog" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-4 hidden md:flex md:flex-col z-40">
      <div className="flex items-center gap-3 px-3 pb-5 mb-5 border-b border-[var(--border)]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-lg">
          <i className="fas fa-graduation-cap" />
        </div>
        <div className="text-lg font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
          Code Tutor AI
        </div>
      </div>

      <nav className="flex-1 px-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                active
                  ? "bg-[color-mix(in_oklab,var(--primary)_15%,transparent)] text-[var(--primary)]"
                  : "text-[var(--muted)] hover:bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] hover:text-[var(--primary)]"
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center`} />
              <span className="text-sm md:text-[15px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pt-4 mt-auto border-t border-[var(--border)] text-[13px] text-[var(--muted)]">
        <p>Code Tutor AI v1.0</p>
        <p>Powered by AI</p>
      </div>
    </aside>
  );
} 