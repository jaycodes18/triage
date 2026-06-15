# Triage

An AI-powered exam prep planner that tells you exactly what to study and what to skip based on how much time you have left. Every other study tool says "study everything." Triage respects that time is limited and generates a ruthlessly prioritized plan.

## Stack

Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · Framer Motion · Zustand · Recharts · Google Gemini 2.5 Flash. Fully client-side, no backend.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add your Gemini API key. Copy the example env file and fill it in:

   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local`:

   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
   ```

   Get a free key at https://aistudio.google.com/apikey

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000

## How it works

- **Setup (`/`)** — a four-step full-screen flow: subject → time available → topics → confidence sweep. One Gemini call runs during the loading orb (minimum 3s).
- **Plan (`/plan/[planId]`)** — a 2×2 priority matrix (Study Hard / Study Smart / Quick Pass / Skip It), a schedule timeline with a focus timer, animated stats, and a tappable topic detail panel with a tips checklist.
- **History (`/history`)** — past plans saved in `localStorage`, viewable offline.

## Notes

- Plans and per-plan progress (completed topics, checked tips) are stored in `localStorage`. Each plan gets a UUID.
- Viewing saved plans works offline; only generating a new plan needs the network.
- The API key is exposed client-side via `NEXT_PUBLIC_`, as specified. For a production deployment you'd typically proxy Gemini through a server route to keep the key private.

## Deploy

Push to a Git repo and import into Vercel. Add `NEXT_PUBLIC_GEMINI_API_KEY` as an environment variable in the Vercel project settings.
