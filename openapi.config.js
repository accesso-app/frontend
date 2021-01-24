module.exports = {
  file: 'https://accesso-app.github.io/backend/api-internal/openapi.yaml',
  templateFileNameCode: 'index.ts',
  outputDir: './src/api',
  presets: [
    [
      'effector-openapi-preset',
      {
        effectorImport: 'effector-root',
        requestName: 'requestFx',
        requestPath: './request',
      },
    ],
  ],
};
