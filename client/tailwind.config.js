/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f4ff",
          100: "#e4e5ff",
          200: "#c4c6ff",
          300: "#9a9eff",
          400: "#6b6dff",
          500: "#4c4bff",
          600: "#3734d6",
          700: "#2926a3",
          800: "#1c1a70",
          900: "#111040",
        },
        surface: {
          50: "#f9fafb",
          100: "#f3f4f6",
          800: "#111827",
          900: "#020617",
        },
      },
      boxShadow: {
        card: "0 18px 45px rgba(15, 23, 42, 0.6)",
      },
      borderRadius: {
        xl: "1.25rem",
      },
    },
  },
  plugins: [],
};