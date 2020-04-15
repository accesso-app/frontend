import { performance } from 'perf_hooks';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { matchRoutes, MatchedRoute } from 'react-router-config';
import { ServerStyleSheet } from 'styled-components';

import { fork, serialize, allSettled, Scope } from 'effector/fork';
import {
  Event,
  forward,
  guard,
  launch,
  root,
  sample,
  Store,
} from 'effector-root';
import { START } from 'lib/effector';

import {
  setCookiesForRequest,
  $cookiesFromResponse,
  $cookiesForRequest,
} from 'api/request';
import { $lastPushed } from 'features/navigation';
import { readyToLoadSession } from 'features/session';

import { Application } from './application';
import { routes } from './pages/routes';

const serverStarted = root.createEvent<{
  req: express.Request;
  res: express.Response;
}>();

const requestHandled = serverStarted.map(({ req }) => req);

const cookiesReceived = requestHandled.filterMap((req) => req.headers.cookie);

const routesMatched = requestHandled.map((req) =>
  matchRoutes(routes, req.url).filter(lookupStartEvent),
);

const eventsMatched = routesMatched.map((routes) =>
  routes.map(lookupStartEvent),
);

for (const { component } of routes) {
  guard({
    source: eventsMatched,
    filter: (matchedEvents) => matchedEvents.includes(component[START]),
    target: component[START],
  });
}

forward({
  from: cookiesReceived,
  to: setCookiesForRequest,
});

forward({
  from: serverStarted,
  to: readyToLoadSession,
});

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

let assets: any;

const syncLoadAssets = () => {
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};
syncLoadAssets();

export const server = express()
  .disable('x-powered-by')
  .use(
    '/api/v0',
    createProxyMiddleware({
      target: process.env.BACKEND_URL ?? 'http://localhost:9005',
      pathRewrite: {
        '^/api/v0': '/',
      },
    }),
  )
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .use(cookieParser())
  .get('/*', async (req: express.Request, res: express.Response) => {
    console.info('[REQUEST] %s %s', req.method, req.url);
    const timeStart = performance.now();
    const scope = fork(root);

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
        <Application root={scope} />
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

    const storesValues = customSerialize(scope, {
      ignore: [$cookiesForRequest, $cookiesFromResponse],
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
        <title>Authmenow</title>
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

function htmlEnd(storesValues: {}): string {
  return `</div>
        <script>
          window.INITIAL_STATE = ${JSON.stringify(storesValues)}
        </script>
    </body>
</html>`;
}

function findStore<T>(scope: Scope, store: Store<T>): Store<T> {
  // @ts-ignore
  return scope.find(store).meta.wrapped;
}

function findEvent<T>(scope: Scope, event: Event<T>): (payload: T) => T {
  // @ts-ignore
  const unit = scope.find(event);

  return (payload) => {
    launch(unit, payload);
    return payload;
  };
}

function lookupStartEvent<P, E>(match: MatchedRoute<P>): Event<E> | undefined {
  if (match.route.component) {
    return match.route.component[START];
  }
  return undefined;
}

function isRedirected(res: express.Response): boolean {
  return res.statusCode >= 300 && res.statusCode < 400;
}

interface SerializeParams {
  ignore?: Array<Store<any>>;
}

// TODO: replace to `serialize(scope, { ignore: [] })`
function customSerialize(scope: Scope, { ignore = [] }: SerializeParams = {}) {
  const result = serialize(scope);
  for (const { sid } of ignore) {
    if (sid) delete result[sid];
  }
  return result;
}
