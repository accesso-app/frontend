module.exports = {
  file: 'https://accesso-app.github.io/backend/api-internal/openapi.yaml',
  templateFileNameCode: 'index.ts',
  outputDir: './src/shared/api',
  presets: [
    [
      'effector-openapi-preset',
      {
        effectorImport: 'effector',
        requestName: 'requestFx',
        requestPath: './request',
      },
    ],
  ],
};
