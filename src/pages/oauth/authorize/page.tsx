import { createStart, withStart } from 'shared/lib/page-routing';

export const pageStarted = createStart();

export const OAuthAuthorizePage = withStart(pageStarted, () => {
  return null;
});
