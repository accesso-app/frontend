export {
  $cookiesFromResponse,
  requestFx,
  setCookiesForRequest,
} from './common';

if (process.env.BUILD_TARGET === 'server') {
  require('./server');
} else {
  require('./client');
}
