/* ===== ToolBox · Tailwind config (static build) — Cobalt dark theme =====
   Compiled once with the Tailwind CLI into css/tailwind.css.
   The runtime Play CDN is gone — nothing recompiles in the browser. */
module.exports = {
  darkMode: "class",
  content: ["./*.html", "./tools/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        /* Near-black navy surfaces (dark theme) */
        night: {
          950: "#060a0f", // page background
          900: "#0a1017",
          850: "#0d1520",
          800: "#111a26", // cards / surfaces
          700: "#172330", // hover elevation
          600: "#22334a", // borders
          500: "#33486a",
          400: "#8ea3b8", // muted text
          300: "#a9bccf",
          200: "#cfe0ef",
        },
        /* Cobalt blues (Cobalt2 inspired) */
        cobalt: {
          200: "#c6f4ff",
          300: "#9effff", // electric cyan
          400: "#38b6ff",
          500: "#0088ff", // cobalt blue
          600: "#0066cc",
          700: "#0052a3",
          800: "#0a3a6b",
        },
        /* Cobalt2 signature yellow */
        volt: "#ffc600",
        /* Light theme surfaces */
        day: {
          50: "#f4f8fc",
          100: "#e9f1f8",
          200: "#d7e5f1",
          300: "#b7cfe3",
          400: "#8fa3b8",
          500: "#64748b", // muted text
          700: "#33475c",
          900: "#0f172a",
        },
      },
      boxShadow: {
        glow: "0 0 24px rgba(0, 136, 255, 0.35)",
        "glow-soft": "0 8px 40px rgba(0, 136, 255, 0.18)",
        card: "0 1px 3px rgba(2, 6, 12, 0.4), 0 10px 30px rgba(2, 6, 12, 0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "grad-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-9px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "grad-shift": "grad-shift 6s ease infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 5s ease-in-out infinite",
      },
    },
  },
};