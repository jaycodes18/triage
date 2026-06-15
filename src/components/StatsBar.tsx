"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { GeminiPlanResponse } from "@/types";

function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

function Stat({ value, label }: { value: number; label: string }) {
  const display = useCountUp(value);
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl sm:text-4xl font-semibold text-text-primary tabular-nums">
        {display}
      </span>
      <span className="text-xs sm:text-sm text-text-secondary mt-1 text-center">
        {label}
      </span>
    </div>
  );
}

export default function StatsBar({ plan }: { plan: GeminiPlanResponse }) {
  const master = plan.topics.filter(
    (t) => t.priority === "critical" || t.priority === "important"
  ).length;
  const skim = plan.topics.filter((t) => t.priority === "skim").length;
  const skip = plan.topics.filter((t) => t.priority === "skip").length;

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-2xl px-6 py-5 grid grid-cols-3 gap-4"
      >
        <Stat value={master} label="topics to master" />
        <Stat value={skim} label="topics to skim" />
        <Stat value={skip} label="topics to skip" />
      </motion.div>

      {plan.strategy && (
        <motion.blockquote
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-4 rounded-2xl border-l-2 border-accent bg-accent/10 px-5 py-4 text-sm sm:text-base text-text-primary"
        >
          {plan.strategy}
        </motion.blockquote>
      )}
    </div>
  );
}
