"use client";

import { motion } from "framer-motion";
import type { PlanTopic } from "@/types";
import { priorityMeta, formatMinutes } from "@/lib/priority";

interface TopicCardProps {
  topic: PlanTopic;
  index: number;
  completed: boolean;
  onClick: () => void;
}

export default function TopicCard({
  topic,
  index,
  completed,
  onClick,
}: TopicCardProps) {
  const meta = priorityMeta[topic.priority];
  const isSkip = topic.priority === "skip";

  return (
    <motion.button
      layout
      layoutId={`topic-${topic.name}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 26,
        delay: index * 0.05,
      }}
      onClick={onClick}
      className={`w-full text-left glass-card rounded-xl p-3 hover:border-accent/50 ${
        isSkip ? "opacity-55" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <span
          className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${meta.dotClass}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {completed && <span className="text-good text-sm">✓</span>}
            <span
              className={`font-medium text-sm text-text-primary truncate ${
                isSkip ? "line-through decoration-skip" : ""
              } ${completed ? "line-through decoration-good/60" : ""}`}
            >
              {topic.name}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1 line-clamp-2">
            {topic.reason}
          </p>
          {!isSkip && (
            <span className="inline-block mt-2 text-xs font-medium text-text-secondary">
              {formatMinutes(topic.studyMinutes)}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
