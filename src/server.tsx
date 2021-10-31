import { performance } from 'perf_hooks';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { matchRoutes } from 'react-router-config';
import { ServerStyleSheet } from 'styled-components';

import {
  createEvent,
  fork,
  serialize,
  allSettled,
  forward,
  guard,
  sample,
} from 'effector';

import { getStart, lookupStartEvent, routeWithEvent } from 'lib/page-routing';

import {
  setCookiesForRequest,
  $cookiesFromResponse,
  $cookiesForRequest,
} from 'api/request';
import { $lastPushed } from 'features/navigation';
import { readyToLoadSession, sessionLoaded } from 'features/session';

import { Application } from './application';
import { routes } from './pages/routes';
import { setCookiesFromResponse } from './api/request/common';
import { path } from './pages/paths';

const OAUTH_CACHE_KEY = 'oauth-params';

process.on('unhandledRejection', (error) => {
  // Will print "unhandledRejection err is not defined"
  console.error('unhandledRejection', error);
});

const dotenvLoaded = dotenv.config();
if (dotenvLoaded.error) {
  throw dotenvLoaded.error;
}

const serverStarted =
  createEvent<{
    req: express.Request;
    res: express.Response;
  }>();

const requestHandled = serverStarted.map(({ req }) => req);

const cookiesReceived = requestHandled.filterMap((req) => req.headers.cookie);

const routesMatched = requestHandled.map((req) => {
  const url = `${req.protocol}://${req.hostname}${req.originalUrl}`;
  return {
    routes: matchRoutes(routes, req.path).filter(lookupStartEvent),
    query: Object.fromEntries(new URL(url).searchParams),
    originalUrl: req.originalUrl,
  };
});

forward({
  from: cookiesReceived,
  to: setCookiesForRequest,
});

forward({
  from: serverStarted,
  to: readyToLoadSession,
});

// TODO logged for each oauth/authorize, but never invalidated
// TODO probably path should be set more precisely
// TODO Also different from setCookiesFromResponse event should be sent
guard({
  source: routesMatched,
  filter: ({ originalUrl }) => originalUrl.includes(path.oauthAuthorize()),
  target: setCookiesFromResponse.prepend(
    ({ query }: { query: Record<string, string> }) =>
      `${OAUTH_CACHE_KEY}=${JSON.stringify(query)}; path=/`,
  ),
});

for (const { component } of routes) {
  const startPageEvent = getStart(component);
  if (!startPageEvent) continue;

  const matchedRoute = sample(routesMatched, sessionLoaded).filterMap(
    ({ routes, query }) => {
      const route = routes.find(routeWithEvent(startPageEvent));
      if (route) return { route, query };
      return undefined;
    },
  );

  forward({
    from: matchedRoute,
    to: startPageEvent.prepend(({ route, query }) => ({
      params: route.match.params,
      query,
    })),
  });
}

sample({
  source: serverStarted,
  clock: $cookiesFromResponse,
  fn: ({ res }, cookies) => ({ res, cookies }),
}).watch(({ res, cookies }) => res.setHeader('Set-Cookie', cookies));

sample({
  source: serverStarted,
  clock: $lastPushed,
  fn: ({ res }, redirectUrl) => ({ res, redirectUrl }),
}).watch(({ res, redirectUrl }) => res.redirect(redirectUrl));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let assets: any;

const syncLoadAssets = () => {
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};
syncLoadAssets();

export const server = express()
  .disable('x-powered-by')
  .use(
    '/api/internal',
    createProxyMiddleware({
      target: process.env.BACKEND_URL ?? 'http://accesso.local:9005',
      pathRewrite: {
        '^/api/internal': '',
      },
      logLevel: 'debug',
      secure: false,
      changeOrigin: true,
      onError(error) {
        console.error('[proxy error]', error);
      },
    }),
  )
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .use(cookieParser())
  .get('/*', async (req: express.Request, res: express.Response) => {
    console.info('[REQUEST] %s %s', req.method, req.url);
    const timeStart = performance.now();
    const scope = fork();

    try {
      await allSettled(serverStarted, {
        scope,
        params: { req, res },
      });
    } catch (error) {
      console.log(error);
    }

    const context = {};
    const sheet = new ServerStyleSheet();

    const jsx = sheet.collectStyles(
      <StaticRouter context={context} location={req.url}>
        <Application scope={scope} />
      </StaticRouter>,
    );

    if (isRedirected(res)) {
      cleanUp();
      console.info(
        '[REDIRECT] from %s to %s at %sms',
        req.url,
        res.get('Location'),
        (performance.now() - timeStart).toFixed(2),
      );
      return;
    }

    const stream = sheet.interleaveWithNodeStream(
      ReactDOMServer.renderToNodeStream(jsx),
    );

    const storesValues = serialize(scope, {
      ignore: [$cookiesForRequest, $cookiesFromResponse],
      onlyChanges: true,
    });

    res.write(htmlStart(assets.client.css, assets.client.js));
    stream.pipe(res, { end: false });
    stream.on('end', () => {
      res.end(htmlEnd(storesValues));
      cleanUp();
      console.info(
        '[PERF] sent page at %sms',
        (performance.now() - timeStart).toFixed(2),
      );
    });

    function cleanUp() {
      sheet.seal();
    }
  });

function htmlStart(assetsCss: string, assetsJs: string) {
  return `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Accesso</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${assetsCss ? `<link rel="stylesheet" href="${assetsCss}">` : ''}
          ${
            process.env.NODE_ENV === 'production'
              ? `<script src="${assetsJs}" defer></script>`
              : `<script src="${assetsJs}" defer crossorigin></script>`
          }
    </head>
    <body>
        <div id="root">`;
}

function htmlEnd(storesValues: Record<string, unknown>): string {
  return `</div>
        <script>
          window['INITIAL_STATE'] = ${JSON.stringify(storesValues)}
        </script>
        ${
          process.env.STATUSPAGE_ID
            ? `<script src="https://${process.env.STATUSPAGE_ID}.statuspage.io/embed/script.js"></script>`
            : ''
        }
    </body>
</html>`;
}

function isRedirected(res: express.Response): boolean {
  return res.statusCode >= 300 && res.statusCode < 400;
}
