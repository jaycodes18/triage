"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "@/store/usePlanStore";
import { matchSuggestedTopics } from "@/data/suggestedTopics";

export default function TopicsInput() {
  const subject = usePlanStore((s) => s.subject);
  const topics = usePlanStore((s) => s.topics);
  const addTopic = usePlanStore((s) => s.addTopic);
  const removeTopic = usePlanStore((s) => s.removeTopic);
  const next = usePlanStore((s) => s.next);

  const [draft, setDraft] = useState("");

  const suggestions = useMemo(() => {
    const all = matchSuggestedTopics(subject);
    return all.filter(
      (s) => !topics.some((t) => t.toLowerCase() === s.toLowerCase())
    );
  }, [subject, topics]);

  const canContinue = topics.length >= 3;

  const commitDraft = () => {
    const parts = draft.split(",");
    parts.forEach((p) => {
      const clean = p.trim();
      if (clean) addTopic(clean);
    });
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitDraft();
    } else if (e.key === "Backspace" && draft === "" && topics.length > 0) {
      removeTopic(topics[topics.length - 1]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 flex flex-col items-center text-center">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-semibold tracking-tight"
      >
        What topics are on this exam?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
        className="mt-3 text-text-secondary max-w-md"
      >
        List everything on the syllabus. Don&rsquo;t worry about order.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        className="mt-10 w-full glass-card rounded-2xl p-4 min-h-[120px]"
      >
        <div className="flex flex-wrap gap-2 items-center">
          <AnimatePresence>
            {topics.map((topic) => (
              <motion.span
                key={topic}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-1.5 bg-surface-elevated border border-border rounded-full pl-3 pr-2 py-1.5 text-sm text-text-primary"
              >
                {topic}
                <button
                  onClick={() => removeTopic(topic)}
                  className="text-text-secondary hover:text-urgency w-4 h-4 flex items-center justify-center"
                  aria-label={`Remove ${topic}`}
                >
                  ×
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commitDraft}
            placeholder={
              topics.length === 0 ? "Type a topic, press Enter…" : "Add another…"
            }
            className="flex-1 min-w-[140px] bg-transparent text-text-primary placeholder:text-text-secondary/60 focus:outline-none py-1.5 text-left"
          />
        </div>
      </motion.div>

      <p className="mt-3 text-xs text-text-secondary max-w-md">
        Check your syllabus, past papers, or ask your teacher. The more topics
        you add, the better your plan.
      </p>

      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 w-full"
        >
          <p className="text-sm text-text-secondary mb-3">Suggested topics</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => addTopic(s)}
                className="px-3.5 py-1.5 rounded-full text-sm border border-border text-text-secondary hover:text-text-primary hover:border-accent/50 transition"
              >
                + {s}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="mt-12 flex flex-col items-center gap-2">
        <button
          disabled={!canContinue}
          onClick={() => canContinue && next()}
          className={`px-10 py-3.5 rounded-xl font-medium text-base ${
            canContinue
              ? "bg-accent text-white glow-ring hover:brightness-110"
              : "bg-surface-elevated text-text-secondary cursor-not-allowed"
          }`}
        >
          Continue
        </button>
        {!canContinue && (
          <span className="text-xs text-text-secondary">
            Add at least {3 - topics.length} more topic
            {3 - topics.length === 1 ? "" : "s"} to continue
          </span>
        )}
      </div>
    </div>
  );
}
