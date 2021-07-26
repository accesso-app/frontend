import { createEvent, createStore, guard, sample } from 'effector-root';
import { historyPush } from '../navigation';
import { path } from '../../pages/paths';

export const redirectOAuthAuthorize = createEvent<OAuthSettings>();

export const $oauthSettings = createStore<OAuthSettings | null>(null);

const continueRedirect = createEvent<OAuthSettings>();

$oauthSettings.on(redirectOAuthAuthorize, (_, payload) => payload);

guard({
  source: redirectOAuthAuthorize,
  filter: ({ redirectUri }) => !redirectUri,
  target: historyPush.prepend(path.home),
});

guard({
  source: redirectOAuthAuthorize,
  filter: ({ redirectUri }) => Boolean(redirectUri),
  target: continueRedirect,
});

sample({
  source: continueRedirect,
  target: historyPush,
  fn: (settings) =>
    path.oauthAuthorize(
      settings.clientId,
      settings.redirectUri,
      settings.responseType,
    ),
});

export interface OAuthSettings {
  redirectUri: string;
  clientId: string;
  scope: string | null | undefined;
  responseType: string;
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
