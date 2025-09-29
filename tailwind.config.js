/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Performance colors for StatusCircle
        'status-grey': '#9ca3af',
        'status-green': '#10b981',
        'status-lime': '#84cc16',
        'status-yellow': '#eab308',
        'status-orange': '#f97316',
        'status-red': '#ef4444',
      },
      spacing: {
        '7': '28px', // StatusCircle small size
        '10': '40px', // StatusCircle medium size
        '14': '56px', // StatusCircle large size
      }
    },
  },
  plugins: [],
}
