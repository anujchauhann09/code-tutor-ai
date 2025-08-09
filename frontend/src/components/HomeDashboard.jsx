"use client";

import Header from "@/components/Header";
import { generateAnswer } from "@/lib/gemini";
import { loadValue, saveValue } from "@/lib/storage";
import { useEffect, useMemo, useRef, useState } from "react";

function formatResponseToHtml(text) {
  if (!text) return "";
  
  let formatted = text;
  
  // Escape HTML entities first
  const escapeHtml = (str) => str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
  
  // Handle code blocks with language detection
  formatted = formatted.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'text';
    const escapedCode = escapeHtml(code.trim());
    const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
    return `<div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-language">${language}</span>
        <button class="copy-btn" data-code-id="${codeId}">
          <i class="fas fa-copy"></i> Copy
        </button>
      </div>
      <pre class="code-block"><code id="${codeId}" class="language-${language}">${escapedCode}</code></pre>
    </div>`;
  });
  
  // Handle inline code
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  
  // Handle bold text
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="bold-text">$1</strong>');
  
  // Handle bullet points with better styling
  formatted = formatted.replace(/^\* (.+)$/gm, '<li class="bullet-item">$1</li>');
  formatted = formatted.replace(/(<li class="bullet-item">.*<\/li>)/s, '<ul class="bullet-list">$1</ul>');
  
  // Handle numbered lists
  formatted = formatted.replace(/^\d+\. (.+)$/gm, '<li class="numbered-item">$1</li>');
  formatted = formatted.replace(/(<li class="numbered-item">.*<\/li>)/s, '<ol class="numbered-list">$1</ol>');
  
  // Handle headers
  formatted = formatted.replace(/^### (.+)$/gm, '<h3 class="response-h3">$1</h3>');
  formatted = formatted.replace(/^## (.+)$/gm, '<h2 class="response-h2">$1</h2>');
  formatted = formatted.replace(/^# (.+)$/gm, '<h1 class="response-h1">$1</h1>');
  
  // Handle paragraphs with better spacing
  const paragraphs = formatted.split(/\n\s*\n/).filter(p => p.trim()).map(p => {
    p = p.trim();
    // Don't wrap if it's already a block element
    if (p.startsWith('<div') || p.startsWith('<ul') || p.startsWith('<ol') || 
        p.startsWith('<h1') || p.startsWith('<h2') || p.startsWith('<h3') ||
        p.startsWith('<pre')) {
      return p;
    }
    return `<p class="response-paragraph">${p}</p>`;
  }).join('');
  
  return paragraphs;
}

export default function HomeDashboard() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [outputHtml, setOutputHtml] = useState("");
  const outputRef = useRef(null);

  const history = useMemo(() => loadValue("history", []), []);

  useEffect(() => {
    setOutputHtml([
      `<p>Welcome to <strong>Code Tutor AI</strong>! Ask any programming question and get expert guidance.</p>`,
      `<p>Try: <code>How do React useEffect hooks work?</code> or <code>Implement merge sort in Python</code></p>`,
    ].join(""));
  }, []);

  // Handle copy button clicks
  useEffect(() => {
    const handleCopyClick = (e) => {
      if (e.target.closest('.copy-btn')) {
        const button = e.target.closest('.copy-btn');
        const codeId = button.getAttribute('data-code-id');
        const codeElement = document.getElementById(codeId);
        if (codeElement) {
          navigator.clipboard.writeText(codeElement.textContent).then(() => {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            button.style.background = 'var(--success)';
            setTimeout(() => {
              button.innerHTML = originalText;
              button.style.background = 'var(--primary)';
            }, 2000);
          }).catch(() => {
            button.innerHTML = '<i class="fas fa-times"></i> Failed';
            button.style.background = 'var(--danger)';
            setTimeout(() => {
              button.innerHTML = '<i class="fas fa-copy"></i> Copy';
              button.style.background = 'var(--primary)';
            }, 2000);
          });
        }
      }
    };

    const outputElement = outputRef.current;
    if (outputElement) {
      outputElement.addEventListener('click', handleCopyClick);
      return () => outputElement.removeEventListener('click', handleCopyClick);
    }
  }, [outputHtml]);

  async function onAsk() {
    const q = question.trim();
    if (!q) {
      setError("Please enter a coding question first.");
      return;
    }
    setError("");
    setLoading(true);
    setOutputHtml("");

    // Conversation-based history: group by sessionId
    const sessionId = loadValue("current_session_id", null) || crypto.randomUUID();
    const all = loadValue("history", []);
    const conversationHistory = all
      .filter((h) => h.sessionId === sessionId)
      .slice(-6) // last 3 pairs
      .map((m) => ({ role: m.role, text: m.text }));

    try {
      const answer = await generateAnswer({ question: q, history: conversationHistory });

      const now = Date.now();
      const newItems = [
        ...all,
        { id: crypto.randomUUID(), sessionId, role: "user", text: q, ts: now },
        { id: crypto.randomUUID(), sessionId, role: "model", text: answer, ts: now },
      ];
      saveValue("history", newItems);
      saveValue("current_session_id", sessionId);

      setOutputHtml(formatResponseToHtml(answer));
      setQuestion("");
      requestAnimationFrame(() => {
        outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: "smooth" });
      });
    } catch (e) {
      setError(e.message || "Failed to get an answer.");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onAsk();
    }
  }

  return (
    <>
      <Header title="Code Tutor AI" />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--border)] p-4 bg-[color-mix(in_oklab,var(--card)_80%,transparent)] hover:border-[var(--primary)] transition">
              <div className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">3,847</div>
              <div className="text-sm text-[var(--muted)]">Code Solutions</div>
            </div>
            <div className="rounded-xl border border-[var(--border)] p-4 bg-[color-mix(in_oklab,var(--card)_80%,transparent)] hover:border-[var(--primary)] transition">
              <div className="text-2xl font-bold bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent">42</div>
              <div className="text-sm text-[var(--muted)]">Tech Stacks</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <h2 className="font-semibold text-[15px]"><i className="fas fa-fire text-[var(--warning)] mr-2" /> Popular Topics</h2>
          </div>
          <ul className="p-5 space-y-3 text-[15px]">
            {["Node.js Streams","TypeScript Generics","Database Indexing","API Design Patterns","Docker Containers"].map((t) => (
              <li key={t} className="flex items-center gap-2"><i className="fas fa-chevron-right text-[var(--primary)]" /> {t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <h2 className="font-semibold text-[15px]"><i className="fas fa-question-circle text-[var(--secondary)] mr-2" /> Ask a Coding Question</h2>
          </div>
          <div className="p-5">
            <div className="flex items-start gap-3 mb-3 rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_85%,transparent)] p-4">
              <i className="fas fa-info-circle text-[var(--primary)] mt-1" />
              <div className="text-sm text-[var(--muted)]">
                Ask any coding question. Non-coding questions will be politely declined.
              </div>
            </div>

            <label className="block text-sm font-medium mb-2"><i className="fas fa-terminal mr-2" /> Your Coding Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="e.g., How do React useEffect hooks work?, Implement merge sort in Python"
              className="w-full min-h-[140px] resize-y rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_85%,transparent)] p-4 outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--primary)_35%,transparent)]"
            />

            <button
              disabled={loading}
              onClick={onAsk}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white font-semibold py-3 shadow hover:translate-y-[-2px] transition active:translate-y-0 disabled:opacity-60"
            >
              <i className="fas fa-paper-plane" /> Ask Code Tutor
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <h2 className="font-semibold text-[15px]"><i className="fas fa-graduation-cap text-[var(--success)] mr-2" /> Tutor's Response</h2>
          </div>
          <div className="p-5">
            {loading && (
              <div className="text-center py-8">
                <div className="mx-auto mb-3 h-10 w-10 rounded-full border-4 border-[color-mix(in_oklab,var(--primary)_20%,transparent)] border-t-[var(--primary)] animate-spin" />
                <p className="text-sm text-[var(--muted)]">Analyzing your question...</p>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-[var(--danger)] text-[var(--danger)] bg-[color-mix(in_oklab,var(--danger)_10%,transparent)] mb-3">
                <i className="fas fa-exclamation-triangle mt-1" />
                <div className="text-sm">{error}</div>
              </div>
            )}
            <div
              ref={outputRef}
              className="ai-response-container min-h-[220px] max-h-[60vh] overflow-y-scroll overflow-x-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_85%,transparent)] p-5 leading-7 text-[15px] w-full max-w-full"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--primary) var(--card)' }}
              dangerouslySetInnerHTML={{ __html: outputHtml }}
            />
          </div>
        </div>
      </section>
    </>
  );
} 