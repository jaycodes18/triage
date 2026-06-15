"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "@/store/usePlanStore";
import type { TimeframeKey } from "@/types";

interface CardDef {
  key: Exclude<TimeframeKey, "custom">;
  title: string;
  subtext: string;
  icon: React.ReactNode;
}

const MoonIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const ClockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const CARDS: CardDef[] = [
  { key: "tonight", title: "Tonight", subtext: "Less than 12 hours", icon: <MoonIcon /> },
  { key: "few-days", title: "A few days", subtext: "1–4 days", icon: <CalendarIcon /> },
  { key: "week-plus", title: "A week or more", subtext: "5+ days", icon: <ClockIcon /> },
];

const LABELS: Record<Exclude<TimeframeKey, "custom">, string> = {
  tonight: "Tonight (less than 12 hours)",
  "few-days": "A few days (1–4 days)",
  "week-plus": "A week or more (5+ days)",
};

export default function TimeInput() {
  const timeframeKey = usePlanStore((s) => s.timeframeKey);
  const examDate = usePlanStore((s) => s.examDate);
  const setTimeframe = usePlanStore((s) => s.setTimeframe);
  const next = usePlanStore((s) => s.next);

  const hasSelection = timeframeKey !== null;

  const pickCard = (card: CardDef) => {
    setTimeframe(card.key, LABELS[card.key], null);
  };

  const pickDate = (value: string) => {
    if (!value) {
      setTimeframe("custom", "", null);
      return;
    }
    const iso = new Date(value).toISOString();
    setTimeframe("custom", `Exam on ${new Date(value).toLocaleString()}`, iso);
  };

  // Value for the datetime-local input (local, no seconds)
  const dateInputValue = examDate
    ? toLocalInputValue(new Date(examDate))
    : "";

  return (
    <div className="w-full max-w-3xl mx-auto px-6 flex flex-col items-center text-center">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-semibold tracking-tight"
      >
        How much time do you have?
      </motion.h1>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {CARDS.map((card, i) => {
          const selected = timeframeKey === card.key;
          return (
            <motion.button
              key={card.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * i }}
              onClick={() => pickCard(card)}
              className={`glass-card rounded-2xl p-6 flex flex-col items-center gap-3 ${
                selected
                  ? "glow-ring scale-[1.03] border-accent"
                  : "hover:border-accent/50"
              }`}
              style={{ transitionProperty: "transform, box-shadow, border-color" }}
            >
              <span
                className={selected ? "text-accent" : "text-text-secondary"}
              >
                {card.icon}
              </span>
              <span className="text-lg font-medium text-text-primary">
                {card.title}
              </span>
              <span className="text-sm text-text-secondary">
                {card.subtext}
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-10 w-full max-w-md"
      >
        <label className="block text-sm text-text-secondary mb-2">
          Or pick your exact exam date and time
        </label>
        <input
          type="datetime-local"
          value={dateInputValue}
          onChange={(e) => pickDate(e.target.value)}
          className={`w-full bg-surface rounded-xl border px-4 py-3 text-text-primary focus:outline-none ${
            timeframeKey === "custom" && examDate
              ? "border-accent glow-ring"
              : "border-border focus:border-accent/60"
          }`}
        />
      </motion.div>

      <AnimatePresence>
        {hasSelection && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            onClick={next}
            className="mt-12 px-10 py-3.5 rounded-xl font-medium text-base bg-accent text-white glow-ring hover:brightness-110"
          >
            Continue
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
