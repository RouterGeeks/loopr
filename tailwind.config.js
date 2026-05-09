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
        'cream-light': '#FBF7F1',
        'cream-surface': '#F9F3E9',
        lavender: '#B89DD8',
        'lavender-soft': '#D7CBED',
        'lavender-light': '#E6DFF4',
        'lavender-dark': '#8E70B0',
        seafoam: '#A8DADC',
        charcoal: '#2B2B2B',
        'charcoal-soft': '#3A3A3A',
      },
      boxShadow: {
        soft: '0 10px 28px rgba(43, 43, 43, 0.08)',
        'card': '0 8px 24px rgba(43, 43, 43, 0.09)',
        'nav': '0 -1px 18px rgba(43, 43, 43, 0.08)',
      },
      spacing: {
        'safe': 'max(1rem, env(safe-area-inset-bottom))',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}