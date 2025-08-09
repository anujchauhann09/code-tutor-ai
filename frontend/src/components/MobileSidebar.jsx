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

export default function MobileSidebar({ open, onClose }) {
  const pathname = usePathname();
  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`absolute left-0 top-0 h-full w-[80%] max-w-[320px] border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-4 transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white">
              <i className="fas fa-graduation-cap" />
            </div>
            <div className="font-bold">Code Tutor AI</div>
          </div>
          <button onClick={onClose} className="px-2 py-1 rounded-md border border-[var(--border)]">
            <i className="fas fa-times" />
          </button>
        </div>
        <nav>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  active
                    ? "bg-[color-mix(in_oklab,var(--primary)_15%,transparent)] text-[var(--primary)]"
                    : "text-[var(--muted)] hover:bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] hover:text-[var(--primary)]"
                }`}
              >
                <i className={`fas ${item.icon} w-5 text-center`} />
                <span className="text-[15px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
} 