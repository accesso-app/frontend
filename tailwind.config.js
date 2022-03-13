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
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '4.25rem',
        14: '4.5rem',
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
