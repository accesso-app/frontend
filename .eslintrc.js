require('@eslint-kit/eslint-config-patch');

module.exports = {
  extends: [
    '@eslint-kit/base',
    '@eslint-kit/typescript',
    '@eslint-kit/node',
    '@eslint-kit/react',
    '@eslint-kit/prettier',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'import/no-unresolved': 'off',
    'sonarjs/no-duplicate-string': 'off',
    'no-console': 'off',

    // TODO: maybe try another way?
    // now used for client/ssr variables
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
