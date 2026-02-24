/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          950: "#070b10",
          900: "#0A0A0A",
          800: "#111820",
          700: "#161d28",
          600: "#1e2836",
        },
        accent: {
          teal: "#14b8a6",
          tealLight: "#2dd4bf",
          tealDark: "#0d9488",
        },
        warm: {
          gold: "#fbbf24",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "mesh-gradient": "radial-gradient(at 40% 20%, rgba(20, 184, 166, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(20, 184, 166, 0.08) 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
};
