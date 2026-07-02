/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B1F3A",
        blue: "#1D4ED8",
        slate: "#475569",
        line: "#E2E8F0",
        tint: "#F8FAFC"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"]
      }
    }
  },
  plugins: []
};
