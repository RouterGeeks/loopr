/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paper surfaces — cooler stone paper, modern editorial notebook
        cream: '#E5E1D8',
        'cream-light': '#F7F5F0',
        'cream-surface': '#F7F5F0',
        paper: '#E5E1D8',
        'paper-light': '#F7F5F0',
        'paper-edge': '#DCD7CB',
        'paper-shell': '#E5E1D8',
        // Ink — cool graphite tone, deeper and slightly cooler
        charcoal: '#232220',
        'charcoal-soft': '#3E3B37',
        ink: '#232220',
        'ink-soft': '#3E3B37',
        // Accents — restrained, dusty
        lavender: '#7E69A6',
        'lavender-soft': '#C9BEDC',
        'lavender-light': '#E1DAE9',
        'lavender-dark': '#5F4F84',
        sage: '#8B9F77',
        // Legacy alias — Doing state still references `seafoam` in places
        seafoam: '#8B9F77',
        // Notebook margin rule — muted brick red (kept for legacy)
        'margin-rule': '#B3604F',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(35, 34, 32, 0.05)',
        card: '0 1px 3px rgba(35, 34, 32, 0.07), 0 2px 8px rgba(35, 34, 32, 0.04)',
        nav: '0 -1px 0 rgba(35, 34, 32, 0.08)',
      },
      borderColor: {
        rule: 'rgba(35, 34, 32, 0.12)',
        'rule-soft': 'rgba(35, 34, 32, 0.06)',
      },
      spacing: {
        'safe': 'max(1rem, env(safe-area-inset-bottom))',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'system-ui', 'sans-serif'],
        serif: ['"New York"', '"Iowan Old Style"', 'Charter', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', '"Courier New"', 'monospace'],
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