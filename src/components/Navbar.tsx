"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStoredApiKey, setStoredApiKey, clearStoredApiKey } from "@/lib/apiKey";

export default function Navbar() {
  const pathname = usePathname();
  const onHistory = pathname === "/history";
  const [showModal, setShowModal] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [saved, setSaved] = useState(false);

  function openModal() {
    setKeyInput(getStoredApiKey() ?? "");
    setSaved(false);
    setShowModal(true);
  }

  function handleSave() {
    const trimmed = keyInput.trim();
    if (trimmed) setStoredApiKey(trimmed);
    else clearStoredApiKey();
    setSaved(true);
    setTimeout(() => setShowModal(false), 800);
  }

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40">
        <div className="glass-surface border-b border-border">
          <nav className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="relative flex h-6 w-6 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-accent/30 blur-[6px] group-hover:bg-accent/50 transition" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <span className="font-semibold tracking-tight text-text-primary">
                Triage
              </span>
            </Link>

            <div className="flex items-center gap-1 text-sm">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-lg ${
                  !onHistory
                    ? "text-text-primary bg-surface-elevated"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                New plan
              </Link>
              <Link
                href="/history"
                className={`px-3 py-1.5 rounded-lg ${
                  onHistory
                    ? "text-text-primary bg-surface-elevated"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                History
              </Link>
              <button
                onClick={openModal}
                title="API Key settings"
                className="ml-1 px-2.5 py-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0zm2.5-1a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="currentColor"/>
                  <path d="M9.5 4.5V3a2 2 0 0 0-4 0v1.5A5.5 5.5 0 1 0 13 7.5a5.48 5.48 0 0 0-3.5-5zm-3-1.5a1 1 0 0 1 2 0v1.07a5.53 5.53 0 0 0-2 0V3zM7.5 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm border border-border">
            <h2 className="text-base font-semibold text-text-primary">API Key</h2>
            <p className="mt-1 text-xs text-text-secondary">
              Stored only in your browser. Get a free key at{" "}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                aistudio.google.com
              </a>.
            </p>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIza..."
              className="mt-4 w-full bg-surface-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent/60 transition"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:brightness-110 transition"
              >
                {saved ? "Saved ✓" : "Save"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-border text-text-secondary hover:text-text-primary transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
