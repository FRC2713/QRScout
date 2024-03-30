module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        rhr: ['"SF Sports Night"'],
        'rhr-ns': ['"SF Sports Night NS"'],
      },
      colors: {
        lightYellow: { rhr: '#fff200' },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
