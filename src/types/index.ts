export type Priority = "critical" | "important" | "skim" | "skip";

export type TimeframeKey = "tonight" | "few-days" | "week-plus" | "custom";

export interface TopicConfidence {
  name: string;
  confidence: number; // 1-5
}

export interface PlanTopic {
  name: string;
  priority: Priority;
  studyMinutes: number;
  reason: string;
  tips: string[];
}

export interface ScheduleBlock {
  timeBlock: string;
  activity: string;
  durationMinutes: number;
}

export interface GeminiPlanResponse {
  strategy: string;
  totalStudyMinutes: number;
  topics: PlanTopic[];
  schedule: ScheduleBlock[];
}

export interface SavedPlan {
  id: string;
  subject: string;
  examDate: string | null; // ISO string or null
  timeframeLabel: string;
  timeframeKey: TimeframeKey;
  topics: TopicConfidence[];
  plan: GeminiPlanResponse;
  createdAt: string; // ISO string
}

// Per-plan local UI progress (checked tips, completed topics) — kept separate from the immutable plan
export interface PlanProgress {
  completedTopics: string[];
  checkedTips: Record<string, number[]>; // topicName -> array of checked tip indices
}
