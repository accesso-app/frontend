import https from 'https';
import fs from 'fs';
import path from 'path';

// this require is necessary for server HMR to recover from error
// tslint:disable-next-line:no-var-requires
let app = require('./server').server;

if (module.hot) {
  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');
    try {
      app = require('./server').server;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

const port = parseInt(process.env.PORT ?? '3000', 10);

function createServer() {
  const CRT = path.resolve(__dirname, '..', 'tls', 'authmenow.crt');
  const KEY = path.resolve(__dirname, '..', 'tls', 'authmenow.key');

  const options = {
    cert: fs.readFileSync(CRT),
    key: fs.readFileSync(KEY),
  };

  return https.createServer(options, app);
}

export default createServer().listen(port, () => {
  console.log(`> Started on port ${port}`);
});
