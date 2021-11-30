const path = require('path');
const fs = require('fs');

module.exports = {
  plugins: [
    {
      name: 'typescript',
      options: {
        useBabel: true,
      },
    },
  ],
  modifyWebpackConfig({ webpackConfig, env: { dev, target } }) {
    webpackConfig.resolve.modules.unshift(path.resolve(__dirname, 'src'));

    webpackConfig.resolve.alias['@auth/ui'] = path.resolve(__dirname, 'src', 'ui');

    webpackConfig.module.rules[1].exclude.push(/\.svg$/);
    webpackConfig.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    if (dev) {
      webpackConfig.devServer = {
        ...webpackConfig.devServer,
        key: fs.readFileSync(path.resolve(__dirname, 'tls', 'accesso.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'tls', 'accesso.crt')),
        https: true,
        host: process.env.RAZZLE_DEV_SERVER_HOST || 'localhost',
      };
    }

    return webpackConfig;
  },
};
