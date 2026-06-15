"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { setStoredApiKey } from "@/lib/apiKey";

interface ApiKeySetupProps {
  onKeySet: () => void;
  onDemo: () => void;
}

export default function ApiKeySetup({ onKeySet, onDemo }: ApiKeySetupProps) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed) {
      setError("Please enter your API key.");
      return;
    }
    if (!trimmed.startsWith("AIza")) {
      setError("That doesn't look right — Gemini API keys start with \"AIza\".");
      return;
    }
    setStoredApiKey(trimmed);
    onKeySet();
  }

  return (
    <div className="fixed inset-0 z-50 bg-bg flex items-center justify-center px-5">
      <div className="absolute inset-0 ambient-glow pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-accent/30 blur-[6px]" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span className="font-semibold tracking-tight text-text-primary text-lg">Triage</span>
        </div>

        <h1 className="text-2xl font-bold text-text-primary leading-tight">
          Add your Gemini API key
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Triage uses Google Gemini to build your study plan. Your key is stored
          only in your browser — never sent to any server.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError("");
              }}
              placeholder="AIza..."
              className="w-full bg-surface-elevated border border-border rounded-xl px-4 py-3 pr-12 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition text-xs"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-medium bg-accent text-white glow-ring hover:brightness-110 transition text-sm"
          >
            Save key &amp; continue
          </button>
        </form>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-secondary">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={onDemo}
          className="mt-3 w-full py-3 rounded-xl font-medium border border-border text-text-secondary hover:text-text-primary hover:border-accent/40 transition text-sm"
        >
          Try with demo data
        </button>

        <p className="mt-5 text-xs text-text-secondary text-center">
          Get a free key at{" "}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            aistudio.google.com/apikey
          </a>
          {" "}— no credit card needed.
        </p>
      </motion.div>
    </div>
  );
}
