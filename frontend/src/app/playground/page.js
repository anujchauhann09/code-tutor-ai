"use client";

import AppShell from "@/components/AppShell";
import Header from "@/components/Header";
import { useMemo, useState } from "react";

const languages = [
  { id: "javascript", name: "JavaScript (runnable)" },
  // { id: "python", name: "Python" },
  // { id: "typescript", name: "TypeScript" },
  // { id: "cpp", name: "C++" },
  // { id: "java", name: "Java" },
];

export default function PlaygroundPage() {
  const [lang, setLang] = useState("javascript");
  const [code, setCode] = useState("// Write some JavaScript here\nconsole.log('Hello, Code Tutor AI!')");
  const [output, setOutput] = useState("");

  const placeholder = useMemo(() => {
    switch (lang) {
      case "python":
        return "# Python example\nprint('Hello, Code Tutor AI!')";
      case "typescript":
        return "// TypeScript example\nconst msg: string = 'Hello';\nconsole.log(msg);";
      case "cpp":
        return "// C++ example\n#include <iostream>\nint main(){ std::cout << \"Hello\"; }";
      case "java":
        return "// Java example\nclass Main { public static void main(String[] a){ System.out.println(\"Hello\"); } }";
      default:
        return "// JS example\nconsole.log('Hello, Code Tutor AI!')";
    }
  }, [lang]);

  function runCode() {
    if (lang !== "javascript") {
      setOutput("Execution is available for JavaScript only in this demo.");
      return;
    }
    try {
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.join(" "));
      // eslint-disable-next-line no-new-func
      new Function(code)();
      console.log = originalLog;
      setOutput(logs.join("\n"));
    } catch (e) {
      setOutput(`Error: ${e.message}`);
    }
  }

  return (
    <AppShell>
      <Header title="Playground" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm">Language</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="rounded-md border border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_85%,transparent)] p-2 text-sm"
            >
              {languages.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={placeholder}
            className="w-full h-[360px] font-mono text-sm rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_85%,transparent)] p-3"
          />
          <button onClick={runCode} className="mt-3 inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white px-4 py-2">
            <i className="fas fa-play" /> Run
          </button>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="font-semibold mb-2">Output</div>
          <pre className="min-h-[320px] rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_85%,transparent)] p-3 text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </AppShell>
  );
} 