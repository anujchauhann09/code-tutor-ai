export const STORAGE_PREFIX = "ctai_";

function makeKey(key) {
  return `${STORAGE_PREFIX}${key}`;
}

export function loadValue(key, fallback = null) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(makeKey(key));
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

export function saveValue(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(makeKey(key), JSON.stringify(value));
  } catch (_) {}
}

export function removeValue(key) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(makeKey(key));
  } catch (_) {}
} 