/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      colors: {
        ink: {
          950: "#09090b", // Zinc 950
          900: "#18181b", // Zinc 900
          850: "#27272a", // Zinc 800
          800: "#3f3f46", // Zinc 700
          700: "#52525b", // Zinc 600
          600: "#71717a", // Zinc 500
          500: "#a1a1aa", // Zinc 400
        },
        accent: {
          DEFAULT: "#3b82f6", // Blue 500
          dark: "#2563eb",   // Blue 600
          glow: "#3b82f633",
        },
        signal: {
          red: "#ef4444",   // Red 500
          amber: "#f59e0b", // Amber 500
          blue: "#3b82f6",
          violet: "#8b5cf6",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
        "card-hover": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.5" },
          "100%": { transform: "scale(2)", opacity: "0" },
        }
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out both",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
};
