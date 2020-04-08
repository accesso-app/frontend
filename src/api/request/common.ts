import {
  createEvent,
  createEffect,
  restore,
  attach,
  Effect,
  guard,
  merge,
} from 'lib/effector';

import queryString from 'query-string';

export type Request = {
  path: string;
  method: string;
  body?: object | null | void;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  cookies?: string;
};

export type Answer = {
  ok: boolean;
  body: string | void | object;
  status: number;
  headers: Record<string, string>;
};

export const setCookiesForRequest = createEvent<string>();
// WARNING: cookies should be sent only to an OUR backend
// Any other can steal the access token
export const $cookiesForRequest = restore(setCookiesForRequest, '');

export const setCookiesFromResponse = createEvent<string>();
export const $cookiesFromResponse = restore(setCookiesFromResponse, '');

export const requestInternalFx = createEffect<Request, Answer, Answer>();

export const requestFx: Effect<Request, Answer, Answer> = attach({
  effect: requestInternalFx,
  source: $cookiesForRequest,
  mapParams: (params, cookies) => ({ ...params, cookies }),
});

if (process.env.BUILD_TARGET === 'server') {
  // Pass cookies from the client to each request
  $cookiesForRequest.on(setCookiesForRequest, (_, cookies) => cookies);

  // Save cookies from the response to send to the client
  const setCookieHeader = merge([
    requestInternalFx.doneData,
    requestInternalFx.failData,
  ]).map(({ headers }) => headers['set-cookie'] ?? '');

  guard({
    source: setCookieHeader,
    filter: (setCookie) => setCookie !== '',
    target: setCookiesFromResponse,
  });
}

export function queryToString(
  query: Record<string, string> | undefined,
): string {
  return query ? `?${queryString.stringify(query)}` : '';
}

function getSetCookie(headers: Record<string, string>) {}
