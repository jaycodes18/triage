import type { Priority } from "@/types";

export interface PriorityMeta {
  label: string; // quadrant label, e.g. "Study Hard"
  badge: string; // short badge label
  color: string; // hex
  dotClass: string; // tailwind bg class for the urgency dot
  borderClass: string; // tailwind border class
  textClass: string;
}

export const priorityMeta: Record<Priority, PriorityMeta> = {
  critical: {
    label: "Study Hard",
    badge: "Critical",
    color: "#F87171",
    dotClass: "bg-urgency",
    borderClass: "border-urgency",
    textClass: "text-urgency",
  },
  important: {
    label: "Study Smart",
    badge: "Important",
    color: "#FBBF24",
    dotClass: "bg-medium",
    borderClass: "border-medium",
    textClass: "text-medium",
  },
  skim: {
    label: "Quick Pass",
    badge: "Skim",
    color: "#6366F1",
    dotClass: "bg-accent",
    borderClass: "border-accent",
    textClass: "text-accent",
  },
  skip: {
    label: "Skip It",
    badge: "Skip",
    color: "#4B5563",
    dotClass: "bg-skip",
    borderClass: "border-skip",
    textClass: "text-skip",
  },
};

export const quadrantOrder: Priority[] = [
  "critical",
  "important",
  "skim",
  "skip",
];

export function formatMinutes(min: number): string {
  if (min <= 0) return "0 min";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}
