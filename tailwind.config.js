/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5EFE6',
        lavender: '#B19CD9',
        'lavender-light': '#D4CCE8',
        seafoam: '#A8DADC',
        charcoal: '#2B2B2B',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}