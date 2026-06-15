import type { GeminiPlanResponse } from "@/types";

export const DEMO_PLAN: GeminiPlanResponse = {
  strategy:
    "With less than 12 hours, you need to be ruthless. Stoichiometry and Equilibrium are the backbone of AP Chemistry — they show up in almost every exam and you're weakest on them, so they get the bulk of your time. Thermodynamics and Acids/Bases are high-yield and close to your grasp. Skip Electrochemistry and Organic — they're low-weight and you're already decent. Sleep before the exam matters more than a cramming the last hour.",
  totalStudyMinutes: 300,
  topics: [
    {
      name: "Stoichiometry & Mole Calculations",
      priority: "critical",
      studyMinutes: 75,
      reason: "Appears in ~80% of AP Chem exams and you rated your confidence low — this is your biggest lever.",
      tips: [
        "Drill mole-to-mole conversions with 10 practice problems — don't read, calculate.",
        "Memorise the molar mass shortcut: use the periodic table row by row.",
        "Do at least 2 limiting reagent problems from a past FRQ.",
      ],
    },
    {
      name: "Chemical Equilibrium & Le Chatelier",
      priority: "critical",
      studyMinutes: 60,
      reason: "High exam weight and your confidence is only a 2 — every FRQ section touches equilibrium.",
      tips: [
        "Write out the 5 Le Chatelier shifts from memory: temperature, pressure, concentration, volume, inert gas.",
        "Practise writing Kc and Kp expressions for 5 different reactions.",
        "Understand WHY Q vs K tells you which direction a reaction proceeds.",
      ],
    },
    {
      name: "Thermodynamics (ΔG, ΔH, ΔS)",
      priority: "important",
      studyMinutes: 50,
      reason: "Consistently appears in FRQs and the relationship between ΔG, ΔH, and ΔS is a recurring trap.",
      tips: [
        "Memorise the four ΔG sign combinations (spontaneous/non-spontaneous at high/low temp).",
        "Know the formula ΔG = ΔH − TΔS cold — no looking it up.",
        "Link thermodynamics to equilibrium: ΔG° = −RT ln K.",
      ],
    },
    {
      name: "Acids, Bases & Buffers",
      priority: "important",
      studyMinutes: 55,
      reason: "Acid-base is a guaranteed FRQ topic and you're at a 3 — a focused hour can push this to confident.",
      tips: [
        "Know the strong acids and bases by heart — the 6 strong acids, 8 strong bases.",
        "Practise pH calculations for weak acids using ICE tables.",
        "Henderson-Hasselbalch: write it out 5 times and do 3 buffer problems.",
      ],
    },
    {
      name: "Atomic Structure & Periodicity",
      priority: "skim",
      studyMinutes: 30,
      reason: "You rated this a 4 and it's mostly conceptual — a quick review of trends is enough.",
      tips: [
        "Review the 5 periodic trends: atomic radius, ionisation energy, electronegativity, electron affinity, metallic character.",
        "Glance at electron configuration rules (Aufbau, Pauli, Hund) — don't drill them.",
      ],
    },
    {
      name: "Bonding & Molecular Geometry",
      priority: "skim",
      studyMinutes: 30,
      reason: "Moderate exam weight but you're already solid — just refresh VSEPR shapes.",
      tips: [
        "Review the 7 VSEPR shapes and their bond angles.",
        "Know when molecules are polar vs nonpolar based on geometry.",
      ],
    },
    {
      name: "Electrochemistry",
      priority: "skip",
      studyMinutes: 0,
      reason: "Lower exam frequency and you rated yourself a 3 — not worth 2 hours you don't have tonight.",
      tips: [],
    },
    {
      name: "Organic Chemistry Basics",
      priority: "skip",
      studyMinutes: 0,
      reason: "Rarely tested heavily on AP Chem and you have decent confidence — skip entirely tonight.",
      tips: [],
    },
  ],
  schedule: [
    { timeBlock: "Hour 1", activity: "Stoichiometry & Mole Calculations — drill 10 problems", durationMinutes: 60 },
    { timeBlock: "Hour 2", activity: "Chemical Equilibrium & Le Chatelier — write expressions + Q vs K", durationMinutes: 60 },
    { timeBlock: "Hour 3", activity: "Acids, Bases & Buffers — ICE tables + Henderson-Hasselbalch", durationMinutes: 55 },
    { timeBlock: "Hour 4", activity: "Thermodynamics — ΔG combinations + FRQ practice", durationMinutes: 50 },
    { timeBlock: "Hour 5 (first 30 min)", activity: "Atomic Structure skim + Molecular Geometry skim", durationMinutes: 30 },
    { timeBlock: "Final 45 min", activity: "Rest. Seriously. Sleep consolidates memory better than more cramming.", durationMinutes: 45 },
  ],
};

export const DEMO_SAVED_PLAN = {
  id: "demo-plan-id",
  subject: "AP Chemistry",
  examDate: null,
  timeframeLabel: "Tonight (less than 12 hours)",
  timeframeKey: "tonight" as const,
  topics: [
    { name: "Stoichiometry & Mole Calculations", confidence: 2 },
    { name: "Chemical Equilibrium & Le Chatelier", confidence: 2 },
    { name: "Thermodynamics (ΔG, ΔH, ΔS)", confidence: 3 },
    { name: "Acids, Bases & Buffers", confidence: 3 },
    { name: "Atomic Structure & Periodicity", confidence: 4 },
    { name: "Bonding & Molecular Geometry", confidence: 4 },
    { name: "Electrochemistry", confidence: 3 },
    { name: "Organic Chemistry Basics", confidence: 3 },
  ],
  plan: DEMO_PLAN,
  createdAt: new Date().toISOString(),
};
