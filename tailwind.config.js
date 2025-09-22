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
    },
  },
  plugins: [],
};
