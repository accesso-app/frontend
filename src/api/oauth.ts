import * as typed from 'typed-contracts';
import { createResource } from './request';

interface Authorize {
  responseType: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
  state?: string;
}

const TAuthorizeDone = typed.object({
  code: typed.string,
  redirectUri: typed.string,
  state: typed.string.optional,
});

const TAuthorizeFail = typed.object({
  error: typed.union(
    'access_denied',
    'invalid_payload', // failed to parse UUID (for ex.)
    'invalid_request',
    'invalid_scope',
    'server_error',
    'temporarily_unavailable',
    'unauthenticated_user',
    'unauthorized_client',
    'unsupported_response_type',
  ),
  message: typed.string.optional,
  redirectUri: typed.string.optional,
  state: typed.string.optional,
});

export const oauthAuthorize = createResource({
  name: 'oauthAuthorize',
  contractDone: TAuthorizeDone,
  contractFail: TAuthorizeFail,
  mapParams: (params: Authorize) => ({
    path: '/oauth/authorize',
    method: 'POST',
    body: params,
  }),
});
