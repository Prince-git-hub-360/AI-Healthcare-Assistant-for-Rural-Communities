/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        accent: ['Instrument Serif', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          teal: '#0f766e',
          orange: '#ea580c',
        }
      }
    },
  },
  plugins: [],
}
