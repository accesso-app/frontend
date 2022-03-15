module.exports = {
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-react',
    ['@babel/preset-env', { targets: { node: 'current' } }],
    // 'razzle',
    // 'patronum/babel-preset'
  ],
  plugins: [
    ['styled-components', { displayName: true, ssr: true }],
    [
      'effector/babel-plugin',
      {
        debugSids: process.env.EFFECTOR_DEBUG === 'true',
        factories: ['shared/lib/page-routing', 'features/session'],
      },
    ],
  ],
};
