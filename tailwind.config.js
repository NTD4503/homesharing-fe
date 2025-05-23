/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1366DD',
        'custom-pink': '#F24B5A'
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}