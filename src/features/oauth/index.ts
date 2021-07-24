import { createEvent, createStore, guard, sample } from 'effector-root';
import { historyPush } from '../navigation';
import { path } from '../../pages/paths';
import { forward } from 'effector';

export const oauthSettingsUpdate = createEvent<OAuthSettings>();
export const redirectWithOAuthSettings = createEvent<OAuthSettings>();
export const redirectToAuth = createEvent<OAuthSettings>();

export const $oauthSettings = createStore<OAuthSettings | null>(null);

$oauthSettings.on(oauthSettingsUpdate, (_, payload) => payload);

const redirectWithUriCheck = createEvent<OAuthSettings>();

forward({
  from: redirectWithOAuthSettings,
  to: oauthSettingsUpdate,
});

sample({
  source: $oauthSettings,
  clock: redirectWithOAuthSettings,
  fn: (settings) => {
    return {
      clientId: settings!.clientId,
      redirectUri: settings!.redirectUri,
      scope: settings!.scope,
    };
  },
  target: redirectWithUriCheck,
});

guard({
  source: redirectWithUriCheck,
  filter: ({ redirectUri }) => !redirectUri,
  target: historyPush.prepend(path.home),
});

guard({
  source: redirectWithUriCheck,
  filter: ({ redirectUri }) => Boolean(redirectUri),
  target: redirectToAuth,
});

sample({
  source: redirectToAuth,
  target: historyPush,
  fn: (settings) => path.oauthAuthorize(settings.clientId, settings.redirectUri, 'code'),
});

export interface OAuthSettings {
  redirectUri: string;
  clientId: string;
  scope: string | null | undefined;
}

export interface OAuthQueryParams {
  response_type: string;
  client_id: string;
  redirect_uri: string;
  scope: string;
  state: string;
}

export function queryParamsConvertToAuth(query: OAuthQueryParams) {
  const {
    response_type: responseType,
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
  } = query;

  if (responseType !== 'code') return null;
  if (!clientId) return null;
  if (!redirectUri) return null;

  return {
    responseType,
    clientId,
    redirectUri,
    scope,
    state,
  };
}

export function getOauthQueryParams(settings: OAuthSettings) {
  return `?client_id=${settings.clientId}&redirect_uri=${settings.redirectUri}&response_type=code`;
}
