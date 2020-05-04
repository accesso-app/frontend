export {
  $cookiesForRequest,
  $cookiesFromResponse,
  requestFx,
  setCookiesForRequest,
} from './common';

export type { Answer } from './common';
export { createResource } from './resource';

if (process.env.BUILD_TARGET === 'server') {
  require('./server');
} else {
  require('./client');
}
