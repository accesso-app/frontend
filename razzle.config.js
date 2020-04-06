const path = require('path');

module.exports = {
  plugins: [
    {
      name: 'typescript',
      options: {
        useBabel: true,
        forkTsChecker: {
          tslint: false,
        },
      },
    },
  ],
  modify(config) {
    config.resolve.modules.unshift(path.resolve(__dirname, 'src'));

    config.resolve.alias['@auth/ui'] = path.resolve(__dirname, 'src', 'ui');

    // TODO: how do not find rule to config
    config.module.rules[2].exclude.push(/\.svg$/);
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
