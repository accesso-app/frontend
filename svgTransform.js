// This is a custom Jest transformer turning style imports into empty objects.
// http://facebook.github.io/jest/docs/tutorial-webpack.html

module.exports = {
  process(src) {
    return `
    const React = require('react')
    module.exports = () => React.createElement('svg', {});
    Object.defineProperty(exports, '__esModule', {
      value: true,
    });
    `;
  },
  // getCacheKey() {
  //   return Math.random().toString(36);
  // },
};
