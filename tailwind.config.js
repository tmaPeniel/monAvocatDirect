/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Helvetica Neue', 'Arial', 'sans-serif'],
        heading: ['League Spartan', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fca5b0',
          400: '#f77086',
          500: '#d90429',
          600: '#b80024',
          700: '#99001e',
          800: '#7b0019',
          900: '#610014',
        },
      },
    },
  },
  plugins: [],
}
