/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        cream: {
          50: "#FFF5F5",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
        },
        lavender: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#C4B5FD",
          300: "#A78BFA",
        },
        mint: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
        },
        sand: {
          50: "#FEFCE8",
          100: "#FEF9C3",
          200: "#FEF08A",
        },
      },
      fontFamily: {
        display: ["'Outfit'", "'Noto Sans SC'", "sans-serif"],
        sans: ["'Noto Sans SC'", "'Outfit'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.06)",
        pop: "0 8px 30px rgba(0, 0, 0, 0.1)",
        phone: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)",
        glow: "0 0 20px rgba(251,113,133,0.3), 0 0 40px rgba(167,139,250,0.15)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 20px rgba(0,0,0,0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        bounce: "bounce 0.5s ease",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounce: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.95)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(251,113,133,0.3), 0 0 40px rgba(167,139,250,0.15)" },
          "50%": { boxShadow: "0 0 30px rgba(251,113,133,0.5), 0 0 60px rgba(167,139,250,0.25)" },
        },
      },
    },
  },
  plugins: [],
};
