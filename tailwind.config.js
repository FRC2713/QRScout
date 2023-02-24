module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        rhr: ['"SF Sports Night"'],
      },
      colors: {
        red: { rhr: '#ef3340' },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
