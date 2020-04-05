import {
  createStore,
  createEvent,
  createEffect,
  attach,
  Effect,
} from 'effector';
import queryString from 'query-string';

type Cookies = Record<string, string>;

type Request = {
  path: string;
  method: 'POST';
  body?: object | null | void;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  cookies?: Cookies;
};

type Answer = {
  ok: boolean;
  body: string | void | object;
  status: number;
  headers: Record<string, string>;
};

type RequestAuth = Request;

// WARNING: cookies should be sent only on OUR backend
// Any other can steal access token
const $cookies = createStore<Cookies>({});

export const setCookies = createEvent<Cookies>();

export const request = createEffect<Request, Answer, Answer>();

export const requestAuth: Effect<RequestAuth, Answer, Answer> = attach({
  effect: request,
  source: $cookies,
  mapParams(params, cookies) {
    return {
      ...params,
      cookies: {
        ...cookies,
        ...params.cookies,
      },
    };
  },
});

const API_PREFIX = `/api/v0`;

if (process.env.BUILD_TARGET === 'server') {
  $cookies.on(setCookies, (_, cookies) => cookies);
}

if (process.env.BUILD_TARGET === 'server') {
} else {
  request.use(async ({ path, method, ...params }) => {
    const headers = new Headers(params.headers);
    contentDefault(headers, 'application/json');

    const query = params.query ? `?${queryString.stringify(params.query)}` : '';
    const body =
      contentIs(headers, 'application/json') && params.body
        ? JSON.stringify(params.body)
        : undefined;

    const response = await fetch(`${API_PREFIX}${path}${query}`, {
      method,
      headers,
      body,
      credentials: 'same-origin',
    });

    // TODO: rewrite error system

    const answer = contentIs(response.headers, 'application/json')
      ? await response.json()
      : await response.text();

    if (response.ok) {
      return {
        ok: true,
        body: answer,
        status: response.status,
        headers: toObject(response.headers),
      };
    } else {
      throw {
        ok: false,
        body: answer,
        status: response.status,
        headers: toObject(response.headers),
      };
    }
  });
}

/**
 * Check if content-type JSON
 */
function contentIs(headers: Headers, type: string): boolean {
  return headers.get('content-type')?.includes(type) ?? false;
}

function contentDefault(headers: Headers, type: string): Headers {
  if (!headers.has('content-type')) {
    headers.set('content-type', type);
  }
  return headers;
}

function toObject(headers: Headers): Record<string, string> {
  const obj = {};
  headers.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}
