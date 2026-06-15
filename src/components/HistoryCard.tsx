"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Priority, SavedPlan } from "@/types";
import { priorityMeta, quadrantOrder } from "@/lib/priority";

function MiniGrid({ topics }: { topics: SavedPlan["plan"]["topics"] }) {
  const counts: Record<Priority, number> = {
    critical: 0,
    important: 0,
    skim: 0,
    skip: 0,
  };
  topics.forEach((t) => (counts[t.priority] += 1));

  return (
    <div className="grid grid-cols-2 gap-1 w-16 h-16 shrink-0">
      {quadrantOrder.map((p) => (
        <div
          key={p}
          className="rounded-md flex items-center justify-center text-[10px] font-semibold"
          style={{
            backgroundColor: `${priorityMeta[p].color}26`,
            color: priorityMeta[p].color,
          }}
        >
          {counts[p] > 0 ? counts[p] : ""}
        </div>
      ))}
    </div>
  );
}

export default function HistoryCard({
  plan,
  index,
  onDelete,
}: {
  plan: SavedPlan;
  index: number;
  onDelete: (id: string) => void;
}) {
  const examLabel = plan.examDate
    ? new Date(plan.examDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : plan.timeframeLabel || "No date";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative group"
    >
      <Link
        href={`/plan/${plan.id}`}
        className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-accent/50 transition"
      >
        <MiniGrid topics={plan.plan.topics} />
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-text-primary truncate">
            {plan.subject}
          </h3>
          <p className="text-sm text-text-secondary mt-0.5 truncate">
            {examLabel}
          </p>
          <p className="text-xs text-text-secondary/70 mt-1">
            {plan.topics.length} topics
          </p>
        </div>
      </Link>
      <button
        onClick={() => onDelete(plan.id)}
        aria-label="Delete plan"
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition text-text-secondary hover:text-urgency w-7 h-7 rounded-lg flex items-center justify-center hover:bg-surface-elevated"
      >
        ×
      </button>
    </motion.div>
  );
}
