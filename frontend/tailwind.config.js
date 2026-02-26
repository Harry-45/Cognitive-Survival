/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        "cyber-blue": "#3b82f6",
        "cyber-purple": "#8b5cf6",
        "cyber-cyan": "#06b6d4",
        "cyber-bg": "#05060f",
      },
    },
  },
  plugins: [],
}
