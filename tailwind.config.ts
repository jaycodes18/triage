import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0F",
        surface: "#13131A",
        "surface-elevated": "#1C1C27",
        border: "#2A2A3A",
        accent: "#6366F1",
        urgency: "#F87171",
        medium: "#FBBF24",
        good: "#4ADE80",
        skip: "#4B5563",
        "text-primary": "#F1F0FF",
        "text-secondary": "#8B8FA8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(99, 102, 241, 0.4), 0 0 28px rgba(99, 102, 241, 0.25)",
        "glow-sm": "0 0 18px rgba(99, 102, 241, 0.25)",
      },
      backdropBlur: {
        glass: "16px",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.04)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
