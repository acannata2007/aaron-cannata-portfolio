/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBFAF8",
        ink: "#13203A",
        green: "#1E7A4D",
        slate: "#55606E",
        hairline: "#E5E2DB",
        tint: "#F2F1EC"
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"]
      }
    }
  },
  plugins: []
};
