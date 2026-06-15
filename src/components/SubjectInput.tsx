"use client";

import { motion } from "framer-motion";
import { usePlanStore } from "@/store/usePlanStore";

const QUICK_PICKS = [
  "Math",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Economics",
  "Computer Science",
  "English",
];

export default function SubjectInput() {
  const subject = usePlanStore((s) => s.subject);
  const setSubject = usePlanStore((s) => s.setSubject);
  const next = usePlanStore((s) => s.next);

  const canContinue = subject.trim().length > 0;

  const handleContinue = () => {
    if (canContinue) next();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 flex flex-col items-center text-center">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary"
      >
        What&rsquo;s the exam?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
        className="mt-3 text-text-secondary max-w-md"
      >
        Tell us the subject so we know how exams in this area typically look.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        className="mt-12 w-full"
      >
        <input
          autoFocus
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleContinue();
          }}
          placeholder="e.g. AP Chemistry, Calculus BC, Biology Unit 3..."
          className="w-full bg-transparent text-center text-2xl sm:text-3xl font-medium text-text-primary placeholder:text-text-secondary/60 border-0 border-b-2 border-border focus:border-accent focus:outline-none pb-3 transition-colors"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-10 flex flex-wrap justify-center gap-2"
      >
        {QUICK_PICKS.map((pick) => (
          <button
            key={pick}
            onClick={() => setSubject(pick)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              subject === pick
                ? "border-accent text-text-primary glow-ring"
                : "border-border text-text-secondary hover:text-text-primary hover:border-accent/50"
            }`}
          >
            {pick}
          </button>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: canContinue ? 1 : 0.4, y: 0 }}
        transition={{ duration: 0.3 }}
        disabled={!canContinue}
        onClick={handleContinue}
        className={`mt-12 px-10 py-3.5 rounded-xl font-medium text-base ${
          canContinue
            ? "bg-accent text-white glow-ring hover:brightness-110"
            : "bg-surface-elevated text-text-secondary cursor-not-allowed"
        }`}
      >
        Continue
      </motion.button>
    </div>
  );
}
