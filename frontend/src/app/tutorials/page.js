"use client";

import AppShell from "@/components/AppShell";
import Header from "@/components/Header";
import Link from "next/link";

const tutorials = [
  {
    id: 1,
    title: "JavaScript Closures Explained",
    level: "Intermediate",
    summary: "Understand lexical scope and how functions capture variables with practical examples.",
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
  },
  {
    id: 2,
    title: "Python Decorators Guide",
    level: "Intermediate",
    summary: "Learn function wrappers, *args/**kwargs, and preserving metadata with functools.wraps.",
    link: "https://realpython.com/primer-on-python-decorators/",
  },
  {
    id: 3,
    title: "React Hooks – useEffect and useMemo",
    level: "Beginner",
    summary: "Side effects, dependencies, cleanup, memoization, and performance tips.",
    link: "https://react.dev/learn",
  },
];

export default function TutorialsPage() {
  return (
    <AppShell>
      <Header title="Tutorials" />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <ul className="divide-y divide-[var(--border)]">
          {tutorials.map((t) => (
            <li key={t.id} className="py-4 flex items-start justify-between gap-4">
              <div>
                <div className="font-medium mb-1">{t.title}</div>
                <div className="text-xs text-[var(--muted)] mb-2">{t.level}</div>
                <p className="text-sm text-[var(--fg)]/90">{t.summary}</p>
              </div>
              <Link
                href={t.link}
                target="_blank"
                className="text-sm px-3 py-1.5 rounded-md border border-[var(--border)] hover:bg-[color-mix(in_oklab,var(--primary)_8%,transparent)]"
              >
                Open
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
} 