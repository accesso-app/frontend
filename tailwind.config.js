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
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'disabled'],
      textColor: ['disabled'],
      cursor: ['disabled'],
      borderColor: ['disabled', 'focus'],
    },
  },
};
