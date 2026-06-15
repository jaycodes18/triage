import type {
  GeminiPlanResponse,
  PlanTopic,
  Priority,
  ScheduleBlock,
  TopicConfidence,
} from "@/types";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GeneratePlanArgs {
  subject: string;
  timeframeLabel: string;
  topics: TopicConfidence[];
}

function buildPrompt({ subject, timeframeLabel, topics }: GeneratePlanArgs): string {
  const topicLines = topics
    .map((t) => `${t.name} (confidence: ${t.confidence})`)
    .join(", ");

  return `You are an expert academic advisor helping a student prepare for an upcoming exam. Subject: ${subject}. Time available: ${timeframeLabel}. Topics and student confidence levels (1=no idea, 5=got it): ${topicLines}. Your job is to generate a ruthlessly prioritized study plan. For each topic, assign: a priority level ('critical', 'important', 'skim', or 'skip'), an estimated study time in minutes, a brief reason for the priority (1 sentence), and 2-3 specific study tips for that topic. Also generate a day-by-day or hour-by-hour schedule that fits within the available time. Also generate an overall strategy summary (2-3 sentences) explaining the approach. Critical topics are high exam weight AND the student is weak on them. Important topics are either high weight or a significant gap. Skim means low weight or student already knows it well — spend minimal time. Skip means very low exam weight AND student has decent confidence — not worth the time. Be direct and honest. If the student has 6 hours, don't pretend they can master everything — tell them what will move the needle most. Return ONLY valid JSON in this exact format: { strategy: string, totalStudyMinutes: number, topics: [ { name: string, priority: 'critical' | 'important' | 'skim' | 'skip', studyMinutes: number, reason: string, tips: string[] } ], schedule: [ { timeBlock: string, activity: string, durationMinutes: number } ] }`;
}

function stripFences(text: string): string {
  return text
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function extractJsonObject(text: string): string {
  const cleaned = stripFences(text);
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in model response.");
  }
  return cleaned.slice(start, end + 1);
}

const VALID_PRIORITIES: Priority[] = ["critical", "important", "skim", "skip"];

function coerceTopic(raw: unknown): PlanTopic {
  const t = raw as Record<string, unknown>;
  const priority = VALID_PRIORITIES.includes(t.priority as Priority)
    ? (t.priority as Priority)
    : "important";
  const tips = Array.isArray(t.tips)
    ? (t.tips.filter((x) => typeof x === "string") as string[])
    : [];
  return {
    name: typeof t.name === "string" ? t.name : "Untitled topic",
    priority,
    studyMinutes: typeof t.studyMinutes === "number" ? t.studyMinutes : 0,
    reason: typeof t.reason === "string" ? t.reason : "",
    tips,
  };
}

function coerceBlock(raw: unknown): ScheduleBlock {
  const b = raw as Record<string, unknown>;
  return {
    timeBlock: typeof b.timeBlock === "string" ? b.timeBlock : "",
    activity: typeof b.activity === "string" ? b.activity : "",
    durationMinutes: typeof b.durationMinutes === "number" ? b.durationMinutes : 0,
  };
}

function validatePlan(parsed: unknown): GeminiPlanResponse {
  const p = parsed as Record<string, unknown>;
  if (!p || typeof p !== "object") {
    throw new Error("Model response was not an object.");
  }
  if (!Array.isArray(p.topics) || !Array.isArray(p.schedule)) {
    throw new Error("Model response missing topics or schedule.");
  }
  const topics = p.topics.map(coerceTopic);
  const schedule = p.schedule.map(coerceBlock);
  const totalStudyMinutes =
    typeof p.totalStudyMinutes === "number"
      ? p.totalStudyMinutes
      : topics.reduce((sum, t) => sum + t.studyMinutes, 0);

  return {
    strategy: typeof p.strategy === "string" ? p.strategy : "",
    totalStudyMinutes,
    topics,
    schedule,
  };
}

export async function generatePlan(
  args: GeneratePlanArgs
): Promise<GeminiPlanResponse> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing API key. Add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file."
    );
  }

  const prompt = buildPrompt(args);

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Gemini request failed (${res.status}). ${detail.slice(0, 200)}`
    );
  }

  const data = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJsonObject(text));
  } catch {
    throw new Error("Could not parse the plan returned by Gemini.");
  }

  return validatePlan(parsed);
}
