/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: { 100: '#E8EFEA', 500: '#6D9886', 600: '#5F8475' },
        powder: { 100: '#FCEAEA', 500: '#F1A7A7', 600: '#E89696' },
        dark: '#393E46',
        muted: '#929AAB',
        surface: '#FBFBFB'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}