export default {
  content: ["./src/**/*.{11ty.tsx,11ty.jsx,tsx,jsx,md}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6",
          light: "#60A5FA",
          dark: "#2563EB",
        },
        secondary: {
          DEFAULT: "#1F2937",
          light: "#374151",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
