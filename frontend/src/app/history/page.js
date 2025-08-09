"use client";

import AppShell from "@/components/AppShell";
import Header from "@/components/Header";
import { loadValue, removeValue, saveValue } from "@/lib/storage";
import { useEffect, useMemo, useState, useRef } from "react";

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

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [sessions, setSessions] = useState([]);
  const historyRef = useRef(null);

  useEffect(() => {
    const all = loadValue("history", []);
    setItems(all);
    const ids = Array.from(new Set(all.map((h) => h.sessionId))).filter(Boolean);
    setSessions(ids);
  }, []);

  // Handle copy button clicks for history
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

    const historyElement = historyRef.current;
    if (historyElement) {
      historyElement.addEventListener('click', handleCopyClick);
      return () => historyElement.removeEventListener('click', handleCopyClick);
    }
  }, [items]);

  function clearHistory() {
    removeValue("history");
    removeValue("current_session_id");
    setItems([]);
    setSessions([]);
  }

  function startNewConversation() {
    const sessionId = crypto.randomUUID();
    saveValue("current_session_id", sessionId);
    // Navigate remains, user goes back to dashboard to continue.
    alert("New conversation started. Go back to Dashboard to ask your next question.");
  }

  return (
    <AppShell>
      <Header title="History" />

      <div className="w-full max-w-full overflow-hidden">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden w-full max-w-full">
          <div className="px-3 sm:px-5 py-4 border-b border-[var(--border)] flex items-center gap-2 flex-wrap min-w-0">
            <button onClick={startNewConversation} className="text-sm px-3 py-1.5 rounded-md border border-[var(--border)] hover:bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] whitespace-nowrap flex-shrink-0">New Conversation</button>
            <button onClick={clearHistory} className="text-sm px-3 py-1.5 rounded-md border border-[var(--border)] hover:bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] ml-auto whitespace-nowrap flex-shrink-0">Clear</button>
          </div>
          <div ref={historyRef} className="p-3 sm:p-5 space-y-6 max-h-[70vh] overflow-y-auto overflow-x-hidden w-full max-w-full">
            {sessions.length === 0 && <div className="text-sm text-[var(--muted)]">No history yet.</div>}
            {sessions.map((sid) => (
              <div key={sid} className="space-y-2 w-full max-w-full overflow-hidden">
                <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-3 min-w-0">
                  <i className="fas fa-comments flex-shrink-0" />
                  <span className="truncate">Conversation: {sid.slice(0, 8)}…</span>
                </div>
                {(items.filter((i) => i.sessionId === sid)).map((it) => (
                  <div key={it.id} className={`rounded-lg border border-[var(--border)] p-3 sm:p-4 overflow-hidden w-full max-w-full min-w-0 ${
                    it.role === 'user' 
                      ? 'bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] ml-1 sm:ml-4 mr-0' 
                      : 'bg-[color-mix(in_oklab,var(--card)_85%,transparent)] mr-1 sm:mr-4 ml-0'
                  }`}>
                    <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-2 flex-wrap min-w-0">
                      <i className={`fas flex-shrink-0 ${
                        it.role === 'user' ? 'fa-user text-[var(--primary)]' : 'fa-graduation-cap text-[var(--secondary)]'
                      }`} />
                      <span className="whitespace-nowrap flex-shrink-0">{new Date(it.ts).toLocaleString()}</span>
                      <span className="flex-shrink-0">&middot;</span>
                      <span className="capitalize font-medium whitespace-nowrap flex-shrink-0">{it.role === 'user' ? 'You' : 'Code Tutor AI'}</span>
                    </div>
                    {it.role === 'user' ? (
                      <div className="text-[15px] leading-relaxed break-words overflow-wrap-anywhere w-full max-w-full">{it.text}</div>
                    ) : (
                      <div 
                        className="ai-response-container text-[15px] leading-7 overflow-hidden w-full max-w-full min-w-0"
                        dangerouslySetInnerHTML={{ __html: formatResponseToHtml(it.text) }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
} 