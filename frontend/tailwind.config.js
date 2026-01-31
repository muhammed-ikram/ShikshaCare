/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#1b5e5f', // Teal from image
        secondary: '#e89e45', // Orange from image
        accent: '#2d7a7b', // Lighter Teal
        dark: '#0f282f', // Dark text
      }
    },
  },
  plugins: [],
}
