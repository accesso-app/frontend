import { matchRoutes } from 'react-router-config';
import { routes } from './routes';
import { path } from './paths';

test('matches exact route', () => {
  const match = matchRoutes(routes, path.oauthAuthorize());
  expect(match[0].route.path).toBe(path.oauthAuthorize());
});

test('matches not found', () => {
  const match = matchRoutes(routes, '/undefined/is/not/exist/route');
  expect(match[0].route.path).toBe('*');
});
