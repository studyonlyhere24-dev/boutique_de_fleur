/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vos couleurs personnalisées si vous en avez
        sage: {
          100: '#e1e7e4',
          500: '#768d80',
          600: '#5f7568',
          700: '#4a5d52',
          900: '#2c3a32',
          950: '#161e1a',
        },
        powder: {
          100: '#f7ebe8',
          500: '#e0a899',
          600: '#c88a7b',
        },
        dark: '#1c1917',
        muted: '#78716c',
      },
      keyframes: {
        drift: {
          '0%': { 
            transform: 'translateY(-10%) translateX(0) rotate(0deg)',
            opacity: '0'
          },
          '10%': { 
            opacity: 'var(--petal-opacity, 0.7)' 
          },
          '90%': { 
            opacity: 'var(--petal-opacity, 0.7)' 
          },
          '100%': { 
            transform: 'translateY(110vh) translateX(var(--dx, 100px)) rotate(360deg)',
            opacity: '0'
          },
        },
      },
      animation: {
        drift: 'drift linear infinite',
      },
    },
  },
  plugins: [],
}