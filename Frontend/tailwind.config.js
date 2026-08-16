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
        display: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        heading: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['Instrument Serif', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          teal: '#0f766e',
          emerald: '#0D9488',
          darkTeal: '#074e47',
          orange: '#ea580c',
        },
        primary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        }
      }
    },
  },
  plugins: [],
}
