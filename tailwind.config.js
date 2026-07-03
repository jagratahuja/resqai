/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        ink: {
          950: "#070a0f",
          900: "#0a0e14",
          850: "#0d1219",
          800: "#111722",
          750: "#161d2a",
          700: "#1c2433",
          600: "#283142",
          500: "#3a4456",
        },
        accent: {
          DEFAULT: "#3ee9b5",
          dark: "#1fb88f",
          glow: "#3ee9b533",
        },
        signal: {
          red: "#ff5a5f",
          amber: "#ffb547",
          blue: "#4aa8ff",
          violet: "#9b8cff",
        },
      },
      boxShadow: {
        "glow-accent": "0 0 0 1px #3ee9b522, 0 8px 30px -8px #3ee9b544",
        "glow-red": "0 0 0 1px #ff5a5f22, 0 8px 30px -8px #ff5a5f44",
        card: "0 1px 0 0 #ffffff08 inset, 0 12px 32px -12px #00000088",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "scan": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        "scan": "scan 2.5s ease-in-out infinite",
        "blink": "blink 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
