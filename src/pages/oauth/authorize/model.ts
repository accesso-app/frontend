import { forward } from 'effector-root';
import { createStart } from 'lib/page-routing';
import { checkAuthenticated } from 'features/session';
import { oauthAuthorize } from 'api/oauth';
import { historyPush } from 'features/navigation';

export const pageStarted = createStart();

const pageReady = checkAuthenticated({ when: pageStarted });

const authorizeReceived = pageReady.map(({ query }) => ({
  responseType: query['response_type'],
  clientId: query['client_id'],
  redirectUri: query['redirect_uri'],
  ...(query['scope'] && { scope: query['scope'] }),
  ...(query['state'] && { state: query['state'] }),
}));

forward({
  from: authorizeReceived,
  to: oauthAuthorize,
});

const redirect = oauthAuthorize.doneBody.filterMap(
  ({ code, redirectUri, state }) => {
    if (redirectUri) {
      const url = new URL(redirectUri);
      url.searchParams.set('code', code);
      if (state) {
        url.searchParams.set('state', state);
      }
      return url.toString();
    }
    return undefined;
  },
);

forward({
  from: redirect,
  to: historyPush,
});
