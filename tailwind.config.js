/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  daisyui: {
    themes: ["dark"],
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
