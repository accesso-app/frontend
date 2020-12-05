import fetch, { Headers } from 'node-fetch';
import { queryToString, Request, requestInternalFx } from './common';

requestInternalFx.use(requestServer);

const API_PREFIX = process.env.BACKEND_URL ?? 'http://localhost:9005';

async function requestServer({ path, method, ...params }: Request) {
  const headers = new Headers({
    ...params.headers,
    cookie: combineCookies(params.headers?.cookie, params.cookies),
  });
  contentDefault(headers, 'application/json; charset=utf-8');
  headers.set(
    'user-agent',
    `accesso-frontend/unknown node/${process.version}-${process.platform}`,
  );

  const query = queryToString(params.query);
  const body =
    contentIs(headers, 'application/json') && params.body
      ? JSON.stringify(params.body)
      : undefined;

  try {
    const response = await fetch(`${API_PREFIX}${path}${query}`, {
      method,
      headers,
      body,
    });

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
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw {
        ok: false,
        body: error,
        status: 900,
        headers: {},
      };
    }
    throw error;
  }
}

function combineCookies(...cookies: Array<string | undefined>): string {
  return cookies.filter(Boolean).join('; ');
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
