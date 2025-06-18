/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./containers/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // DeckEngine Gaming Theme
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        gaming: {
          gold: "#FFD700",
          silver: "#C0C0C0",
          bronze: "#CD7F32",
          victory: "#4ADE80",
          defeat: "#F87171",
          legendary: "#A855F7",
          epic: "#8B5CF6",
          rare: "#3B82F6",
          common: "#6B7280",
        },
        deck: {
          bg: "#1e293b",
          card: "#334155",
          border: "#475569",
          text: "#f1f5f9",
          muted: "#94a3b8",
        },
      },
      animation: {
        "pulse-gaming": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-in": "bounceIn 0.6s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" },
        },
      },
      backgroundImage: {
        "gradient-gaming": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-victory": "linear-gradient(135deg, #4ADE80 0%, #22c55e 100%)",
        "gradient-defeat": "linear-gradient(135deg, #F87171 0%, #ef4444 100%)",
      },
      fontFamily: {
        gaming: ["Orbitron", "monospace"],
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
