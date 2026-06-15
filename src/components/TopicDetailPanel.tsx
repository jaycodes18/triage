"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { PlanTopic } from "@/types";
import { priorityMeta, formatMinutes, type PriorityMeta } from "@/lib/priority";

interface TopicDetailPanelProps {
  topic: PlanTopic | null;
  completed: boolean;
  checkedTips: number[];
  onToggleTip: (tipIndex: number) => void;
  onToggleComplete: () => void;
  onClose: () => void;
}

export default function TopicDetailPanel({
  topic,
  completed,
  checkedTips,
  onToggleTip,
  onToggleComplete,
  onClose,
}: TopicDetailPanelProps) {
  const meta = topic ? priorityMeta[topic.priority] : null;

  return (
    <AnimatePresence>
      {topic && meta && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="hidden sm:flex fixed top-0 right-0 z-50 h-full w-full max-w-md flex-col glass-surface border-l border-border"
          >
            <PanelContent
              topic={topic}
              meta={meta}
              completed={completed}
              checkedTips={checkedTips}
              onToggleTip={onToggleTip}
              onToggleComplete={onToggleComplete}
              onClose={onClose}
            />
          </motion.aside>

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="sm:hidden fixed inset-x-0 bottom-0 z-50 max-h-[85vh] flex flex-col glass-surface border-t border-border rounded-t-3xl"
          >
            <div className="flex justify-center pt-3">
              <span className="h-1 w-10 rounded-full bg-border" />
            </div>
            <PanelContent
              topic={topic}
              meta={meta}
              completed={completed}
              checkedTips={checkedTips}
              onToggleTip={onToggleTip}
              onToggleComplete={onToggleComplete}
              onClose={onClose}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PanelContent({
  topic,
  meta,
  completed,
  checkedTips,
  onToggleTip,
  onToggleComplete,
  onClose,
}: {
  topic: PlanTopic;
  meta: PriorityMeta;
  completed: boolean;
  checkedTips: number[];
  onToggleTip: (i: number) => void;
  onToggleComplete: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-start justify-between p-6 pb-4">
        <div className="min-w-0">
          <span
            className="inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3"
            style={{
              color: meta.color,
              backgroundColor: `${meta.color}1f`,
            }}
          >
            {meta.badge} · {meta.label}
          </span>
          <h3 className="text-xl font-semibold text-text-primary">
            {topic.name}
          </h3>
          {topic.priority !== "skip" && (
            <p className="text-sm text-text-secondary mt-1">
              {formatMinutes(topic.studyMinutes)} of focused study
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-text-secondary hover:text-text-primary text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-elevated"
        >
          ×
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
        <p className="text-sm text-text-secondary leading-relaxed">
          {topic.reason}
        </p>

        {topic.tips.length > 0 && (
          <>
            <h4 className="text-sm font-semibold text-text-primary mt-6 mb-3">
              Study tips
            </h4>
            <ol className="flex flex-col gap-2.5">
              {topic.tips.map((tip, i) => {
                const checked = checkedTips.includes(i);
                return (
                  <li key={i}>
                    <button
                      onClick={() => onToggleTip(i)}
                      className="w-full text-left flex items-start gap-3 glass-card rounded-xl p-3 hover:border-accent/50"
                    >
                      <span
                        className={`mt-0.5 h-5 w-5 shrink-0 rounded-md border flex items-center justify-center text-xs ${
                          checked
                            ? "bg-accent border-accent text-white"
                            : "border-border text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      <span
                        className={`text-sm ${
                          checked
                            ? "text-text-secondary line-through"
                            : "text-text-primary"
                        }`}
                      >
                        {tip}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </div>

      <div className="p-6 pt-4 border-t border-border">
        <button
          onClick={onToggleComplete}
          className={`w-full py-3 rounded-xl font-medium ${
            completed
              ? "bg-surface-elevated text-text-secondary border border-border"
              : "bg-accent text-white glow-ring hover:brightness-110"
          }`}
        >
          {completed ? "Mark as not done" : "Mark as Done"}
        </button>
      </div>
    </div>
  );
}
