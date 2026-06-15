"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { PlanProgress, PlanTopic, SavedPlan } from "@/types";
import { getPlan, getProgress, saveProgress } from "@/lib/storage";
import StatsBar from "@/components/StatsBar";
import PriorityBoard from "@/components/PriorityBoard";
import ScheduleTimeline from "@/components/ScheduleTimeline";
import TopicDetailPanel from "@/components/TopicDetailPanel";

export default function PlanPage() {
  const params = useParams<{ planId: string }>();
  const planId = params?.planId;

  const [loaded, setLoaded] = useState(false);
  const [plan, setPlan] = useState<SavedPlan | null>(null);
  const [progress, setProgress] = useState<PlanProgress>({
    completedTopics: [],
    checkedTips: {},
  });
  const [selected, setSelected] = useState<PlanTopic | null>(null);

  useEffect(() => {
    if (!planId) return;
    setPlan(getPlan(planId));
    setProgress(getProgress(planId));
    setLoaded(true);
  }, [planId]);

  // Persist progress whenever it changes (after initial load).
  useEffect(() => {
    if (loaded && planId) saveProgress(planId, progress);
  }, [progress, loaded, planId]);

  const timeframeLabel = useMemo(() => {
    if (!plan) return "";
    return plan.timeframeLabel || "Custom schedule";
  }, [plan]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        Loading your plan…
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-14">
        <h2 className="text-xl font-semibold">Plan not found</h2>
        <p className="mt-2 text-text-secondary text-sm max-w-sm">
          This plan isn&rsquo;t saved on this device. Start a new one or check
          your history.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-accent text-white glow-ring hover:brightness-110 text-sm font-medium"
          >
            New plan
          </Link>
          <Link
            href="/history"
            className="px-6 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary text-sm font-medium"
          >
            History
          </Link>
        </div>
      </div>
    );
  }

  const toggleComplete = (name: string) => {
    setProgress((p) => {
      const has = p.completedTopics.includes(name);
      return {
        ...p,
        completedTopics: has
          ? p.completedTopics.filter((t) => t !== name)
          : [...p.completedTopics, name],
      };
    });
  };

  const toggleTip = (topicName: string, tipIndex: number) => {
    setProgress((p) => {
      const current = p.checkedTips[topicName] ?? [];
      const has = current.includes(tipIndex);
      return {
        ...p,
        checkedTips: {
          ...p.checkedTips,
          [topicName]: has
            ? current.filter((i) => i !== tipIndex)
            : [...current, tipIndex],
        },
      };
    });
  };

  return (
    <div className="pt-20 pb-16 px-5 max-w-6xl mx-auto">
      {/* Mobile order: stats + strategy first, then board, then schedule.
          Desktop: stats full width, then two columns. */}
      <div className="mb-6">
        <StatsBar plan={plan.plan} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <div>
          <PriorityBoard
            topics={plan.plan.topics}
            subject={plan.subject}
            timeframeLabel={timeframeLabel}
            completedTopics={progress.completedTopics}
            onSelectTopic={setSelected}
          />
        </div>
        <div>
          <ScheduleTimeline plan={plan.plan} />
        </div>
      </div>

      <TopicDetailPanel
        topic={selected}
        completed={selected ? progress.completedTopics.includes(selected.name) : false}
        checkedTips={selected ? progress.checkedTips[selected.name] ?? [] : []}
        onToggleTip={(i) => selected && toggleTip(selected.name, i)}
        onToggleComplete={() => {
          if (selected) toggleComplete(selected.name);
        }}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
