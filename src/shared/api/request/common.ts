import {
  attach,
  createEffect,
  createEvent,
  createStore,
  Effect,
  guard,
  merge,
  restore,
} from 'effector';
import queryString from 'query-string';

export interface Request {
  path: string;
  method: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  body?: object | null | void;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  cookies?: string;
}

export interface Answer<T = unknown> {
  ok: boolean;
  body: T;
  status: number;
  headers: Record<string, string>;
}

export const setCookiesForRequest = createEvent<string>();
// WARNING: cookies should be sent only to an OUR backend
// Any other can steal the access token
export const $cookiesForRequest = restore(setCookiesForRequest, '');

export const setCookiesFromResponse = createEvent<string>();

// Combine all cookies
// TODO Cookies uniqueness should be checked, now it is duplicated in set-cookie header but is unique at browser
export const $cookiesFromResponse = createStore<string>('');
$cookiesFromResponse.on(setCookiesFromResponse, (state, cookie) => {
  return state ? `${state}&${cookie}` : cookie;
});

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
  const setCookieHeader = merge([requestInternalFx.doneData, requestInternalFx.failData]).map(
    ({ headers }) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      return headers['set-cookie'] ?? '';
    },
  );

  guard({
    source: setCookieHeader,
    filter: (setCookie) => setCookie !== '',
    target: setCookiesFromResponse,
  });
}

if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
  requestInternalFx.watch(({ path, method }) => {
    console.log(`[requestInternal] ${method} ${path}`);
  });

  requestInternalFx.done.watch(({ params: { path, method }, result: { status } }) => {
    console.log(`[requestInternal.done] ${method} ${path} : ${status}`);
  });

  requestInternalFx.fail.watch(({ params: { path, method }, error: { status } }) => {
    console.log(`[requestInternal.fail] ${method} ${path} : ${status}`);
  });
}

export function queryToString(query: Record<string, string> | undefined): string {
  return query ? `?${queryString.stringify(query)}` : '';
}
