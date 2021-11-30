import { parse } from 'cookie';
import { combine, createEvent, createStore, guard, sample } from 'effector';

import { path } from 'pages/paths';

import { historyPush, historyPushWithParams } from 'features/navigation';
import { $isAuthenticated, checkAuthenticated } from 'features/session';

import { oauthAuthorizeRequest } from 'shared/api';
import { createStart, StartParams } from 'shared/lib/page-routing';

const COOKIE_PATH = 'oauth-params';

interface OauthParams {
  responseType: 'code';
  clientId: string;
  redirectUri: string;
  scope?: string;
  state?: string;
}

const redirectToLogin = createEvent<StartParams>();
export const pageStarted = createStart();
const pageReady = checkAuthenticated({
  when: pageStarted,
  stop: redirectToLogin,
});

const oauthRequest = createEvent<OauthParams>();

const $oauthParams = createStore<OauthParams | null>(null);

const authorizeReceived = pageStarted.map<OauthParams | null>(({ query }) => {
  let cachedValue;
  if (typeof document !== 'undefined') {
    const cookies = parse(document.cookie);
    if (Object.keys(cookies).length > 0 && cookies[COOKIE_PATH]) {
      cachedValue = JSON.parse(cookies[COOKIE_PATH]);
    }
  }

  const {
    response_type: responseType,
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
  } = cachedValue || query;

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
});

$oauthParams.on(authorizeReceived, (state, params) => params);

const $hasOauthParams = $oauthParams.map((params) => Boolean(params));

// Combined cases
// 1. User is authenticated and query params are good -> proceed further
// 2. User is not authenticated and query params are good -> redirect to login -> go to 1.
// 3. Query params are bad -> redirect to login

const $queryIsGoodAndAuthed = combine([$isAuthenticated, $hasOauthParams]).map(
  ([isAuthenticated, hasOauthParams]) => isAuthenticated && hasOauthParams,
);

const $queryIsGoodAndNotAuthed = combine([$isAuthenticated, $hasOauthParams]).map(
  ([isAuthenticated, hasOauthParams]) => !isAuthenticated && hasOauthParams,
);

const $queryIsBad = $hasOauthParams.map((has) => !has);

// 1.
sample({
  source: $oauthParams,
  clock: guard({
    source: pageReady,
    filter: $queryIsGoodAndAuthed,
  }),
  target: oauthRequest,
  fn: (params) => params!,
});

// 2.
sample({
  source: guard({
    source: redirectToLogin,
    filter: $queryIsGoodAndNotAuthed,
  }),
  target: historyPushWithParams,
  fn: () => ({
    pathname: path.login(),
    params: {
      redirectBackUrl: path.oauthAuthorize(),
    },
  }),
});

// TODO probably should log or emit some error
guard({
  source: redirectToLogin,
  filter: $queryIsBad,
  target: historyPush.prepend(path.login),
});

sample({
  source: guard({
    source: oauthRequest,
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

redirect.watch((url) => {
  if (typeof window !== 'undefined') {
    window.location.href = url;
  } else {
    historyPush(url);
  }
});
