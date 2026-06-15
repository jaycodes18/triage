"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
  "Analyzing your topics...",
  "Weighing exam importance...",
  "Finding your biggest gaps...",
  "Building your triage plan...",
];

export default function LoadingOrb() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % LINES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-bg ambient-glow flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute rounded-full bg-accent/30 blur-3xl"
          style={{ width: 220, height: 220 }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="relative rounded-full"
          style={{
            width: 120,
            height: 120,
            background:
              "radial-gradient(circle at 35% 30%, #818CF8, #6366F1 55%, #4338CA)",
            boxShadow: "0 0 60px rgba(99,102,241,0.55)",
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mt-14 h-7 relative w-full text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45 }}
            className="text-text-secondary text-lg absolute inset-x-0"
          >
            {LINES[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
