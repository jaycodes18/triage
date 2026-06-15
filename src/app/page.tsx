"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "@/store/usePlanStore";
import SubjectInput from "@/components/SubjectInput";
import TimeInput from "@/components/TimeInput";
import TopicsInput from "@/components/TopicsInput";
import ConfidenceSweep from "@/components/ConfidenceSweep";
import LoadingOrb from "@/components/LoadingOrb";
import ApiKeySetup from "@/components/ApiKeySetup";
import { hasApiKey } from "@/lib/apiKey";

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export default function SetupPage() {
  const step = usePlanStore((s) => s.step);
  const direction = usePlanStore((s) => s.direction);
  const status = usePlanStore((s) => s.status);
  const error = usePlanStore((s) => s.error);
  const generatedPlanId = usePlanStore((s) => s.generatedPlanId);
  const back = usePlanStore((s) => s.back);
  const generate = usePlanStore((s) => s.generate);
  const setUseDemo = usePlanStore((s) => s.setUseDemo);

  const router = useRouter();

  // Show API key setup overlay until a key is stored or demo is chosen
  const [keyReady, setKeyReady] = useState(false);
  useEffect(() => {
    setKeyReady(hasApiKey());
  }, []);

  function handleKeySet() {
    setKeyReady(true);
  }

  function handleDemo() {
    setUseDemo(true);
    setKeyReady(true);
  }

  useEffect(() => {
    if (status === "done" && generatedPlanId) {
      router.push(`/plan/${generatedPlanId}`);
    }
  }, [status, generatedPlanId, router]);

  if (!keyReady) {
    return <ApiKeySetup onKeySet={handleKeySet} onDemo={handleDemo} />;
  }

  if (status === "loading") {
    return <LoadingOrb />;
  }

  if (status === "error") {
    return (
      <div className="fixed inset-0 z-50 bg-bg flex flex-col items-center justify-center px-6 text-center">
        <div className="glass-card rounded-2xl p-8 max-w-md">
          <h2 className="text-xl font-semibold text-text-primary">
            We couldn&rsquo;t build your plan
          </h2>
          <p className="mt-3 text-sm text-text-secondary">
            {error || "The planner didn't respond. Check your connection and try again."}
          </p>
          <button
            onClick={generate}
            className="mt-6 px-8 py-3 rounded-xl font-medium bg-accent text-white glow-ring hover:brightness-110"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14">
      <div className="absolute inset-0 ambient-glow pointer-events-none" />

      {step > 1 && (
        <button
          onClick={back}
          className="fixed top-20 left-5 z-30 text-sm text-text-secondary hover:text-text-primary flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-surface-elevated transition"
        >
          <span aria-hidden>←</span> Back
        </button>
      )}

      <div className="relative w-full py-24">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {step === 1 && <SubjectInput />}
            {step === 2 && <TimeInput />}
            {step === 3 && <TopicsInput />}
            {step === 4 && <ConfidenceSweep />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
