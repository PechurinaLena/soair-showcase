/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          primary: '#f97316',
          secondary: '#1a1a2e',
          background: '#faf8f5',
          card: '#ffffff',
          accentLight: '#fff7ed',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }