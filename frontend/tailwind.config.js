module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'brown-800': '#452B1F',
        'brown-dark': '#754975',
        'orange-bright': '#FFC107',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
