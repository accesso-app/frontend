import { forward, guard, sample } from 'effector-root';
import { createStart } from 'lib/page-routing';
import { checkAuthenticated } from 'features/session';
import { oauthAuthorizeRequest } from 'api';
import { historyPush } from 'features/navigation';

interface OauthAuthorize {
  responseType: 'code';
  clientId: string;
  redirectUri: string;
  scope?: string;
  state?: string;
}

export const pageStarted = createStart();

const pageReady = checkAuthenticated({ when: pageStarted });

// TODO: better validation
const authorizeReceived = guard({
  source: pageReady.map<OauthAuthorize | null>(({ query }) => {
    const {
      response_type: responseType,
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      state,
    } = query;

    if (responseType !== 'code') {
      return null;
    }
    if (!clientId) return null;
    if (!redirectUri) return null;

    return {
      responseType,
      clientId,
      redirectUri,
      scope,
      state,
    };
  }),
  filter: Boolean,
});

sample({
  source: guard({
    source: authorizeReceived,
    filter: oauthAuthorizeRequest.pending.map((is) => !is),
  }),
  fn: (authorize) => ({ body: authorize }),
  target: oauthAuthorizeRequest,
});

const redirect = oauthAuthorizeRequest.doneData.filterMap(({ answer }) => {
  const { code, redirectUri, state } = answer;
  if (redirectUri) {
    const url = new URL(redirectUri);
    url.searchParams.set('code', code);
    if (state) {
      url.searchParams.set('state', state);
    }
    return url.toString();
  }
  return undefined;
});

forward({
  from: redirect,
  to: historyPush,
});
