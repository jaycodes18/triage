const STORAGE_KEY = "triage_gemini_api_key";

export function getStoredApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key.trim());
}

export function clearStoredApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasApiKey(): boolean {
  return !!getStoredApiKey();
}
