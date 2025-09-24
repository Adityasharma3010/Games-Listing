/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        press: ['"Press Start 2P"', "cursive"],
        monoton: ["Monoton", "cursive"],
        audiowide: ["Audiowide", "sans-serif"],
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { filter: "drop-shadow(0 0 8px #FFBF00)" },
          "50%": { filter: "drop-shadow(0 0 16px #FFBF00)" },
        },
        "pulse-glow-white": {
          "0%, 100%": { filter: "drop-shadow(0 0 8px #ffffff)" },
          "50%": { filter: "drop-shadow(0 0 16px #ffffff)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 1.5s ease-in-out infinite",
        "pulse-glow-white": "pulse-glow-white 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
