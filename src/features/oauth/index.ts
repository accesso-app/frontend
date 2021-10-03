import { createEvent, guard, sample } from 'effector';
import { historyPush, historyPushWithParams } from '../navigation';
import { path } from '../../pages/paths';

export const redirectOAuthAuthorize = createEvent<OAuthSettings>();

const continueRedirect = createEvent<OAuthSettings>();

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
  target: historyPushWithParams,
  fn: (settings: OAuthSettings) => ({
    pathname: path.oauthAuthorize(),
    params: {
      ...settings,
      scope: settings.scope || '',
    } as Record<string, string>,
  }),
});

export interface OAuthSettings {
  redirectUri: string;
  clientId: string;
  scope: string | null | undefined;
  responseType: string;
  state: string;
}

export interface OAuthQueryParams {
  response_type: string;
  client_id: string;
  redirect_uri: string;
  scope: string;
  state: string;
}
