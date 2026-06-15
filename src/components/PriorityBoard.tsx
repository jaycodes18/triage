"use client";

import { motion } from "framer-motion";
import type { PlanTopic, Priority } from "@/types";
import { priorityMeta, quadrantOrder } from "@/lib/priority";
import TopicCard from "@/components/TopicCard";

interface PriorityBoardProps {
  topics: PlanTopic[];
  subject: string;
  timeframeLabel: string;
  completedTopics: string[];
  onSelectTopic: (topic: PlanTopic) => void;
}

export default function PriorityBoard({
  topics,
  subject,
  timeframeLabel,
  completedTopics,
  onSelectTopic,
}: PriorityBoardProps) {
  const byPriority: Record<Priority, PlanTopic[]> = {
    critical: [],
    important: [],
    skim: [],
    skip: [],
  };
  topics.forEach((t) => byPriority[t.priority].push(t));

  let cardIndex = 0;

  return (
    <div>
      <div className="flex items-baseline gap-3 flex-wrap mb-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Your Triage Plan
        </h2>
      </div>
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <span className="text-sm text-text-secondary">{subject}</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-surface-elevated border border-border text-text-secondary">
          {timeframeLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quadrantOrder.map((priority) => {
          const meta = priorityMeta[priority];
          const items = byPriority[priority];
          const isSkip = priority === "skip";
          return (
            <motion.section
              key={priority}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`glass-card rounded-2xl p-4 border-t-2 ${meta.borderClass} ${
                isSkip ? "opacity-90" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={`text-sm font-semibold ${meta.textClass} ${
                    isSkip ? "line-through decoration-skip/70" : ""
                  }`}
                >
                  {meta.label}
                </h3>
                <span className="text-xs text-text-secondary">
                  {items.length}
                </span>
              </div>
              <div className="flex flex-col gap-2 min-h-[60px]">
                {items.length === 0 ? (
                  <p className="text-xs text-text-secondary/60 italic py-2">
                    Nothing here.
                  </p>
                ) : (
                  items.map((topic) => {
                    const idx = cardIndex++;
                    return (
                      <TopicCard
                        key={topic.name}
                        topic={topic}
                        index={idx}
                        completed={completedTopics.includes(topic.name)}
                        onClick={() => onSelectTopic(topic)}
                      />
                    );
                  })
                )}
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
