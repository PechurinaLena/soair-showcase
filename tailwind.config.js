/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#f97316',
        navy: '#0f172a',
        warm: '#faf8f5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      borderRadius: {
        phone: '2.5rem',
      },
    },
  },
  plugins: [],
};
