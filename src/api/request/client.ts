import { queryToString, Request, requestInternalFx } from './common';

requestInternalFx.use(requestClient);

export const API_PREFIX = process.env.CLIENT_BACKEND_URL ?? `/api/internal`;

async function requestClient({ path, method, ...params }: Request) {
  const headers = new Headers(params.headers);
  contentDefault(headers, 'application/json; charset=utf-8');

  const query = queryToString(params.query);
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

  const responder = {
    ok: response.ok,
    body: answer,
    status: response.status,
    headers: toObject(response.headers),
  };

  if (response.ok) {
    return responder;
  } else {
    throw responder;
  }
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
