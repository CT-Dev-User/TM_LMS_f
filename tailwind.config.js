/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      screens: {
        // Custom breakpoint for iPad Pro in portrait mode
        'ipadpro': {'min': '1024px', 'max': '1366px'},
        // Custom breakpoint for iPad Pro in landscape mode
        'ipadpro-landscape': {'min': '1366px', 'max': '1024px'},
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};