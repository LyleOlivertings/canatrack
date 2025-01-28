/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'green-theme': {
          100: '#E6F5E6',
          200: '#C2EAC2',
          300: '#9EDF9E',
          400: '#7AD47A',
          500: '#56C956', // Primary green
          600: '#3DAF3D',
          700: '#2E8B2E',
          800: '#1F671F',
          900: '#104310',
        },
      },
    },
  },
  plugins: [],
};