/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Wordle colors
        'wordle-correct': '#538d4e',
        'wordle-present': '#b59f3b',
        'wordle-absent': '#3a3a3c',
        'wordle-empty': '#121213',
        'wordle-border': '#3a3a3c',

        // Quantum theme
        'quantum-primary': '#6366f1',
        'quantum-secondary': '#8b5cf6',
        'quantum-accent': '#06b6d4',

        // UI colors
        'bg-primary': '#121213',
        'bg-secondary': '#1a1a1b',
        'text-primary': '#ffffff',
        'text-muted': '#818384',

        // Status colors
        'status-won': '#538d4e',
        'status-lost': '#dc2626',
        'status-bonus': '#fbbf24',
      },
      animation: {
        'flip': 'flip 0.5s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'bounce-in': 'bounce-in 0.3s ease-out',
        'pulse-quantum': 'pulse-quantum 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease infinite',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateX(0deg)' },
          '50%': { transform: 'rotateX(90deg)' },
          '100%': { transform: 'rotateX(0deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-quantum': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
