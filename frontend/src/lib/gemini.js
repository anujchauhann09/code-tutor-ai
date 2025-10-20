import { loadValue } from "@/lib/storage";

// Resolve configuration for the Gemini call from environment or user overrides
export function getGeminiConfig() {
  const envApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  const envModel = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.5-flash";
  const envSystem = process.env.NEXT_PUBLIC_SYSTEM_INSTRUCTION || defaultSystemInstruction;

  const userApiKey = loadValue("api_key", "");
  const userSystem = loadValue("system_instruction", "");
  const userModel = loadValue("model", "");

  return {
    apiKey: (userApiKey || envApiKey).trim(),
    model: (userModel || envModel).trim(),
    systemInstruction: (userSystem || envSystem).trim(),
  };
}

export const defaultSystemInstruction = `You are Code Tutor AI: a friendly, expert coding assistant.
- Purpose: Help with software development tasks only (concepts, algorithms, debugging, reviews, best practices).
- Style: Be concise, clear, and structured. Use headings, bullet points, and short code snippets.
- Code: Prefer minimal, runnable, idiomatic examples. Choose safe defaults. Explain reasoning briefly.
- Limits: If a question is not about programming or software, politely decline and steer back to coding.
- Safety: Do not produce unsafe, malicious, or personal data. Avoid hallucinations; say "I don't know" if unsure.
- Large context: When answers are long, summarize first, then provide detail. Always include a short summary at the end.
- DRY/SOLID: Encourage modular, testable designs; highlight edge cases and complexity when relevant.
`;

/**
 * Call Gemini generateContent with the given question and an optional short history for context.
 * Returns plain text with user-friendly error handling.
 */
export async function generateAnswer({ question, history = [] }) {
  const { apiKey, model, systemInstruction } = getGeminiConfig();

  if (!apiKey) {
    throw new Error("🔑 API key is missing! Please add your Gemini API key in Settings to start coding with AI assistance.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = [
    ...history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    { role: "user", parts: [{ text: question }] },
  ];

  const body = {
    contents,
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      // Handle specific API errors with user-friendly messages
      if (res.status === 400) {
        throw new Error("🤖 Invalid request format. Please try rephrasing your coding question.");
      } else if (res.status === 401 || res.status === 403) {
        throw new Error("🔐 Authentication failed. Please check your API key in Settings.");
      } else if (res.status === 429) {
        throw new Error("⏱️ Too many requests! Please wait a moment before asking another question.");
      } else if (res.status >= 500) {
        throw new Error("🔧 AI service is temporarily unavailable. Please try again in a few moments.");
      } else {
        const details = data?.error?.message || `${res.status} ${res.statusText}`;
        throw new Error(`🚨 Something went wrong: ${details}`);
      }
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (!text) {
      throw new Error("🤔 No response received. Please try asking your question differently.");
    }
    return text;
  } catch (error) {
    // Handle network errors and other exceptions
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error("🌐 Network connection failed. Please check your internet connection and try again.");
    } else if (error.message.startsWith('🔑') || error.message.startsWith('🤖') || 
               error.message.startsWith('🔐') || error.message.startsWith('⏱️') || 
               error.message.startsWith('🔧') || error.message.startsWith('🚨') || 
               error.message.startsWith('🤔') || error.message.startsWith('🌐')) {
      // Re-throw our custom user-friendly errors
      throw error;
    } else {
      // Generic fallback for unexpected errors
      throw new Error("💻 Unexpected error occurred. Please try again or contact support if the issue persists.");
    }
  }
} 