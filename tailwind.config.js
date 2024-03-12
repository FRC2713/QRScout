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
        red: { rhr: '#ef3340' },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
  safelist: [
    {
      pattern: /(text|bg)-(red|orange|yellow|green|blue|purple|pink|gray)-600/,
    },
  ]
}
