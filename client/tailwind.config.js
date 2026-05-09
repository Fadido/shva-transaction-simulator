/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#3F2078",     // deep purple - logo wordmark, headings
          deep: "#2C1657",
          purple: "#6F49C9",      // medium purple - active digit, accents
          teal: "#2DC4D9",        // logo accent, floating "Label"
          lavender: "#D6CCE7",    // time picker card
          softer: "#F2E7FA",      // hover bg
          ink: "#1A1A1A",
          muted: "#6B6B6B",
          line: "#E5E5E5",
        },
      },
      fontFamily: {
        sans: ["Inter", "Heebo", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"DM Serif Display"', "Inter", "Heebo", "serif"],
        rubik: ["Rubik", "Heebo", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 18px -8px rgba(63, 32, 120, 0.18)",
        pop: "0 12px 32px -12px rgba(63, 32, 120, 0.25)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 120ms ease-out",
      },
    },
  },
  plugins: [],
};
