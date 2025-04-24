/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#d1fae5",
          500: "#10b981", // Emerald-500
          600: "#059669", // Darker Emerald
        },
        danger: "#ef4444", // Red-500
        slate: {
          800: "#1e293b", // Dark Slate
          900: "#0f172a",
        },
      },
    },
  },
  plugins: [],
}