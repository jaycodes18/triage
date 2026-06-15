"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { GeminiPlanResponse, Priority } from "@/types";
import { priorityMeta, formatMinutes } from "@/lib/priority";

function priorityForActivity(
  activity: string,
  plan: GeminiPlanResponse
): Priority | null {
  const lower = activity.toLowerCase();
  // Match the highest-priority topic whose name appears in the activity text.
  const order: Priority[] = ["critical", "important", "skim", "skip"];
  let best: Priority | null = null;
  let bestRank = order.length;
  for (const topic of plan.topics) {
    if (lower.includes(topic.name.toLowerCase())) {
      const rank = order.indexOf(topic.priority);
      if (rank < bestRank) {
        bestRank = rank;
        best = topic.priority;
      }
    }
  }
  return best;
}

function borderColorFor(priority: Priority | null): string {
  if (!priority) return "#2A2A3A";
  if (priority === "critical") return "#F87171";
  if (priority === "important") return "#FBBF24";
  if (priority === "skim") return "#6366F1";
  return "#4B5563";
}

export default function ScheduleTimeline({
  plan,
}: {
  plan: GeminiPlanResponse;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startBlock = (index: number) => {
    setActiveIndex(index);
    setSecondsLeft(plan.schedule[index].durationMinutes * 60);
  };

  useEffect(() => {
    if (activeIndex === null) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeIndex]);

  const formatTimer = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-5 flex-wrap gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Your Schedule</h2>
        <span className="text-sm text-text-secondary">
          {formatMinutes(plan.totalStudyMinutes)} total
        </span>
      </div>

      <ol className="relative flex flex-col gap-3">
        {plan.schedule.map((block, i) => {
          const priority = priorityForActivity(block.activity, plan);
          const active = activeIndex === i;
          return (
            <motion.li
              key={`${block.timeBlock}-${i}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
              className={`glass-card rounded-xl p-4 border-l-2 ${
                active ? "glow-ring" : ""
              }`}
              style={{ borderLeftColor: borderColorFor(priority) }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    {block.timeBlock}
                  </div>
                  <div className="text-sm text-text-primary mt-1">
                    {block.activity}
                  </div>
                </div>
                <span className="text-xs text-text-secondary shrink-0 mt-0.5">
                  {formatMinutes(block.durationMinutes)}
                </span>
              </div>

              {active && (
                <div className="mt-3 flex items-center justify-between bg-surface-elevated rounded-lg px-3 py-2">
                  <span className="text-2xl font-semibold tabular-nums text-accent">
                    {formatTimer(secondsLeft)}
                  </span>
                  <span className="text-xs text-text-secondary">
                    Focus block active
                  </span>
                </div>
              )}
            </motion.li>
          );
        })}
      </ol>

      {plan.schedule.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + plan.schedule.length * 0.06 + 0.1 }}
          onClick={() => startBlock(0)}
          className="mt-5 w-full py-3.5 rounded-xl font-medium bg-accent text-white glow-ring hover:brightness-110"
        >
          {activeIndex === null ? "Start Studying" : "Restart first block"}
        </motion.button>
      )}
    </div>
  );
}
