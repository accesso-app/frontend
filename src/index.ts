import 'dotenv/config';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';

// this require is necessary for server HMR to recover from error
// tslint:disable-next-line:no-var-requires
let app = require('./app/server').server;

if (module.hot) {
  module.hot.accept('./app/server', () => {
    console.log('🔁  HMR Reloading `./app/server`...');
    try {
      app = require('./app/server').server;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

const port = Number.parseInt(process.env.PORT ?? '3005', 10);

function createServer() {
  if (process.env.NODE_ENV === 'development') {
    const CRT = path.resolve(__dirname, '..', 'tls', 'accesso.crt');
    const KEY = path.resolve(__dirname, '..', 'tls', 'accesso.key');

    const options = {
      cert: fs.readFileSync(CRT),
      key: fs.readFileSync(KEY),
    };

    // https on deve, because on prod we have nginx reverse proxy
    return https.createServer(options, app);
  }
  return http.createServer({}, app);
}

const server = createServer().listen(port, () => {
  console.log(`> Started on port ${port}`);
});

export default server;
