/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paper surfaces — warm kraft-cream notebook tones
        cream: '#F1E9D6',
        'cream-light': '#FAF4E6',
        'cream-surface': '#FAF4E6',
        paper: '#F1E9D6',
        'paper-light': '#FAF4E6',
        'paper-edge': '#E6DDC6',
        'paper-shell': '#E8DDC4',
        // Ink — warm near-black, like a pencil mark on paper
        charcoal: '#1F1B16',
        'charcoal-soft': '#3A352D',
        ink: '#1F1B16',
        'ink-soft': '#3A352D',
        // Accents — muted, pencil-pigment feel
        lavender: '#8A72B0',
        'lavender-soft': '#D2C5E6',
        'lavender-light': '#E7DEF0',
        'lavender-dark': '#6B5891',
        sage: '#8FA47B',
        // Legacy alias — Doing state still references `seafoam` in places
        seafoam: '#8FA47B',
        // Notebook margin rule — muted brick red
        'margin-rule': '#B3604F',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(31, 27, 22, 0.05)',
        card: '0 1px 3px rgba(31, 27, 22, 0.06), 0 2px 8px rgba(31, 27, 22, 0.04)',
        nav: '0 -1px 0 rgba(31, 27, 22, 0.08)',
      },
      borderColor: {
        rule: 'rgba(31, 27, 22, 0.10)',
        'rule-soft': 'rgba(31, 27, 22, 0.06)',
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