import { createStart, withStart } from 'lib/page-routing';

export const pageStarted = createStart();

export const OAuthAccessoDonePage = withStart(pageStarted, () => {
  return null;
});
