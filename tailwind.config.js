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
        'cream-light': '#FAF8F3',
        lavender: '#B19CD9',
        'lavender-light': '#D4CCE8',
        'lavender-dark': '#9B7BC4',
        seafoam: '#A8DADC',
        charcoal: '#2B2B2B',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(43, 43, 43, 0.08)',
        'card': '0 4px 12px rgba(43, 43, 43, 0.1)',
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