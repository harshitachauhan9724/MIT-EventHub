/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0f172a'
        },
        brand: {
          50: '#eef4ff',
          100: '#dfeaff',
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
        },
        success: '#16a34a',
        warning: '#d97706',
        danger: '#dc2626'
      },
      boxShadow: {
        soft: '0 10px 25px -15px rgba(15, 23, 42, 0.2)',
      }
    },
  },
  plugins: [],
};
