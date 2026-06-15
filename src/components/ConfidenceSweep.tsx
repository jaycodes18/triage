"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "@/store/usePlanStore";

const RATINGS: { value: number; emoji: string; label: string }[] = [
  { value: 1, emoji: "😵", label: "No idea" },
  { value: 2, emoji: "😟", label: "Barely" },
  { value: 3, emoji: "😐", label: "Sort of" },
  { value: 4, emoji: "🙂", label: "Pretty good" },
  { value: 5, emoji: "😎", label: "Got it" },
];

function fillColor(value: number): string {
  if (value <= 1) return "rgba(248, 113, 113, 0.16)"; // red
  if (value <= 3) return "rgba(251, 191, 36, 0.16)"; // amber
  return "rgba(74, 222, 128, 0.16)"; // green
}
function borderColor(value: number): string {
  if (value <= 1) return "#F87171";
  if (value <= 3) return "#FBBF24";
  return "#4ADE80";
}

export default function ConfidenceSweep() {
  const topics = usePlanStore((s) => s.topics);
  const confidences = usePlanStore((s) => s.confidences);
  const setConfidence = usePlanStore((s) => s.setConfidence);
  const generate = usePlanStore((s) => s.generate);

  const ratedCount = topics.filter((t) => confidences[t] !== undefined).length;
  const allRated = ratedCount === topics.length && topics.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          How well do you know each topic?
        </h1>
        <p className="mt-3 text-text-secondary max-w-md mx-auto">
          Be honest — this is just for your plan. Tap to rate each one.
        </p>
      </motion.div>

      <div className="sticky top-14 z-10 w-full py-3 mt-6 mb-2">
        <div className="glass-surface rounded-full px-4 py-2 text-sm text-text-secondary text-center mx-auto w-fit">
          <span className="text-text-primary font-medium">{ratedCount}</span> of{" "}
          {topics.length} rated
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
        {topics.map((topic, i) => {
          const value = confidences[topic];
          const rated = value !== undefined;
          return (
            <motion.div
              key={topic}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.04 * i }}
              className="glass-card rounded-2xl p-4"
              style={{
                backgroundColor: rated ? fillColor(value) : undefined,
                borderColor: rated ? borderColor(value) : undefined,
              }}
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                  {rated && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-lg"
                    >
                      {RATINGS.find((r) => r.value === value)?.emoji}
                    </motion.span>
                  )}
                  <span className="font-medium text-text-primary truncate">
                    {topic}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {RATINGS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setConfidence(topic, r.value)}
                      title={r.label}
                      aria-label={`${topic}: ${r.label}`}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition ${
                        value === r.value
                          ? "bg-surface-elevated scale-110 glow-ring"
                          : "hover:bg-surface-elevated/60 grayscale hover:grayscale-0 opacity-70 hover:opacity-100"
                      }`}
                    >
                      {r.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {allRated && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            onClick={generate}
            className="mt-10 mb-8 px-12 py-4 rounded-xl font-semibold text-base bg-accent text-white glow-ring animate-pulse-glow hover:brightness-110"
          >
            Generate My Plan
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
