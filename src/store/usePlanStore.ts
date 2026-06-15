import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type {
  GeminiPlanResponse,
  SavedPlan,
  TimeframeKey,
  TopicConfidence,
} from "@/types";
import { generatePlan } from "@/lib/gemini";
import { savePlan } from "@/lib/storage";

export type SetupStep = 1 | 2 | 3 | 4;

interface PlanState {
  // Setup flow
  step: SetupStep;
  direction: 1 | -1; // for slide transition direction
  subject: string;
  timeframeKey: TimeframeKey | null;
  timeframeLabel: string;
  examDate: string | null; // ISO string
  topics: string[];
  confidences: Record<string, number>; // topicName -> 1..5

  // Generation
  status: "idle" | "loading" | "error" | "done";
  error: string | null;
  generatedPlanId: string | null;

  // Actions
  setStep: (step: SetupStep) => void;
  next: () => void;
  back: () => void;
  setSubject: (subject: string) => void;
  setTimeframe: (key: TimeframeKey, label: string, examDate: string | null) => void;
  addTopic: (topic: string) => void;
  removeTopic: (topic: string) => void;
  setConfidence: (topic: string, value: number) => void;
  reset: () => void;
  generate: () => Promise<void>;
}

const MIN_LOADING_MS = 3000;

function timeframeLabelFromDate(examDate: string): string {
  const now = Date.now();
  const target = new Date(examDate).getTime();
  const hours = Math.max(0, (target - now) / (1000 * 60 * 60));
  if (hours < 12) {
    return `${Math.round(hours)} hours until exam (less than 12 hours)`;
  }
  const days = hours / 24;
  return `${Math.round(hours)} hours until exam (about ${Math.round(
    days
  )} days)`;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  step: 1,
  direction: 1,
  subject: "",
  timeframeKey: null,
  timeframeLabel: "",
  examDate: null,
  topics: [],
  confidences: {},

  status: "idle",
  error: null,
  generatedPlanId: null,

  setStep: (step) => set({ step }),

  next: () =>
    set((s) => ({
      step: Math.min(4, s.step + 1) as SetupStep,
      direction: 1,
    })),

  back: () =>
    set((s) => ({
      step: Math.max(1, s.step - 1) as SetupStep,
      direction: -1,
    })),

  setSubject: (subject) => set({ subject }),

  setTimeframe: (timeframeKey, timeframeLabel, examDate) =>
    set({ timeframeKey, timeframeLabel, examDate }),

  addTopic: (topic) => {
    const clean = topic.trim();
    if (!clean) return;
    const { topics } = get();
    if (topics.some((t) => t.toLowerCase() === clean.toLowerCase())) return;
    set({ topics: [...topics, clean] });
  },

  removeTopic: (topic) =>
    set((s) => {
      const nextConf = { ...s.confidences };
      delete nextConf[topic];
      return {
        topics: s.topics.filter((t) => t !== topic),
        confidences: nextConf,
      };
    }),

  setConfidence: (topic, value) =>
    set((s) => ({ confidences: { ...s.confidences, [topic]: value } })),

  reset: () =>
    set({
      step: 1,
      direction: 1,
      subject: "",
      timeframeKey: null,
      timeframeLabel: "",
      examDate: null,
      topics: [],
      confidences: {},
      status: "idle",
      error: null,
      generatedPlanId: null,
    }),

  generate: async () => {
    const state = get();
    set({ status: "loading", error: null, generatedPlanId: null });

    const topicConfidences: TopicConfidence[] = state.topics.map((name) => ({
      name,
      confidence: state.confidences[name] ?? 3,
    }));

    // Resolve the timeframe label, recomputing from a custom date if needed.
    let label = state.timeframeLabel;
    if (state.timeframeKey === "custom" && state.examDate) {
      label = timeframeLabelFromDate(state.examDate);
    }

    const started = Date.now();

    try {
      const [plan] = await Promise.all([
        generatePlan({
          subject: state.subject,
          timeframeLabel: label,
          topics: topicConfidences,
        }),
        // Enforce the minimum loading duration for a satisfying orb animation.
        new Promise<void>((resolve) =>
          setTimeout(resolve, MIN_LOADING_MS)
        ),
      ]);

      const elapsed = Date.now() - started;
      if (elapsed < MIN_LOADING_MS) {
        await new Promise<void>((resolve) =>
          setTimeout(resolve, MIN_LOADING_MS - elapsed)
        );
      }

      const id = uuidv4();
      const saved: SavedPlan = {
        id,
        subject: state.subject,
        examDate: state.examDate,
        timeframeLabel: label,
        timeframeKey: state.timeframeKey ?? "custom",
        topics: topicConfidences,
        plan: plan as GeminiPlanResponse,
        createdAt: new Date().toISOString(),
      };
      savePlan(saved);

      set({ status: "done", generatedPlanId: id });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      set({ status: "error", error: message });
    }
  },
}));
