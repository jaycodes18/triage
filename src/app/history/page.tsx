"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SavedPlan } from "@/types";
import { deletePlan, getAllPlans } from "@/lib/storage";
import HistoryCard from "@/components/HistoryCard";

export default function HistoryPage() {
  const [loaded, setLoaded] = useState(false);
  const [plans, setPlans] = useState<SavedPlan[]>([]);

  useEffect(() => {
    setPlans(getAllPlans());
    setLoaded(true);
  }, []);

  const handleDelete = (id: string) => {
    deletePlan(id);
    setPlans(getAllPlans());
  };

  return (
    <div className="pt-24 pb-16 px-5 max-w-4xl mx-auto">
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Past plans</h1>
        <Link
          href="/"
          className="text-sm px-4 py-2 rounded-xl bg-accent text-white glow-ring hover:brightness-110 font-medium"
        >
          New plan
        </Link>
      </div>

      {!loaded ? (
        <p className="text-text-secondary">Loading…</p>
      ) : plans.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center">
          <p className="text-text-primary font-medium">No plans yet</p>
          <p className="text-sm text-text-secondary mt-2 max-w-sm mx-auto">
            Build your first triage plan and it&rsquo;ll show up here for quick
            access — even offline.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-accent text-white glow-ring hover:brightness-110 text-sm font-medium"
          >
            Start a plan
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plans.map((plan, i) => (
            <HistoryCard
              key={plan.id}
              plan={plan}
              index={i}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
