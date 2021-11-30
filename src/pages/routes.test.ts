import { matchRoutes } from 'react-router-config';

import { path } from './paths';
import { routes } from './routes';

test('matches exact route', () => {
  const match = matchRoutes(routes, path.oauthAuthorize());
  expect(match[0].route.path).toBe(path.oauthAuthorize());
});

test('matches not found', () => {
  const match = matchRoutes(routes, '/undefined/is/not/exist/route');
  expect(match[0].route.path).toBe('*');
});
