const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.tsx', './src/**/*.html', './src/**/*.ts'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
      },
      leading: {
        11: 'line-height: 2.75rem',
        12: 'line-height: 3rem',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'disabled'],
      textColor: ['disabled', 'visited'],
      cursor: ['disabled'],
      borderColor: ['disabled', 'focus'],
    },
  },
};
