/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'ysabeau': ['Ysabeau SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
