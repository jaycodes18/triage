import type { PlanProgress, SavedPlan } from "@/types";

const PLANS_KEY = "triage:plans";
const progressKey = (planId: string) => `triage:progress:${planId}`;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getAllPlans(): SavedPlan[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(PLANS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedPlan[];
    if (!Array.isArray(parsed)) return [];
    // Newest first
    return parsed.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

export function getPlan(planId: string): SavedPlan | null {
  return getAllPlans().find((p) => p.id === planId) ?? null;
}

export function savePlan(plan: SavedPlan): void {
  if (!isBrowser()) return;
  try {
    const plans = getAllPlans().filter((p) => p.id !== plan.id);
    plans.push(plan);
    window.localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  } catch {
    // Storage may be full or unavailable; fail silently for viewing flows.
  }
}

export function deletePlan(planId: string): void {
  if (!isBrowser()) return;
  try {
    const plans = getAllPlans().filter((p) => p.id !== planId);
    window.localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
    window.localStorage.removeItem(progressKey(planId));
  } catch {
    // ignore
  }
}

export function getProgress(planId: string): PlanProgress {
  const empty: PlanProgress = { completedTopics: [], checkedTips: {} };
  if (!isBrowser()) return empty;
  try {
    const raw = window.localStorage.getItem(progressKey(planId));
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as PlanProgress;
    return {
      completedTopics: Array.isArray(parsed.completedTopics)
        ? parsed.completedTopics
        : [],
      checkedTips:
        parsed.checkedTips && typeof parsed.checkedTips === "object"
          ? parsed.checkedTips
          : {},
    };
  } catch {
    return empty;
  }
}

export function saveProgress(planId: string, progress: PlanProgress): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(progressKey(planId), JSON.stringify(progress));
  } catch {
    // ignore
  }
}
