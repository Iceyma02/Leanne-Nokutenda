import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0a0408",
        plum: "#1d0b17",
        wine: "#3a0f24",
        burgundy: "#5a1630",
        blush: "#f6d3da",
        rose: "#d98a9d",
        ivory: "#f8f0e6",
        champagne: "#d9c093",
        gold: "#bfa064",
        heart: "#ff3d7f",
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Jost", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "Caveat", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
