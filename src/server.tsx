import { performance } from 'perf_hooks';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { matchRoutes } from 'react-router-config';
import { ServerStyleSheet } from 'styled-components';
import { fork, serialize, allSettled, Scope } from 'effector/fork';
import {
  forward,
  clearNode,
  rootDomain,
  START,
  Store,
  Event,
  launch,
} from 'lib/effector';

import { setCookiesForRequest, $cookiesFromResponse } from 'api/request';
import { $lastPushed } from 'features/navigation';
import { readyToLoadSession } from 'features/session';

import { Application } from './application';
import { ROUTES } from './pages/routes';

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
    const pageEvents = matchRoutes(ROUTES, req.url)
      .map((match) =>
        match.route.component ? match.route.component[START] : undefined,
      )
      .filter(Boolean);

    const startServer = rootDomain.createEvent();

    forward({ from: startServer, to: readyToLoadSession });

    if (pageEvents.length > 0) {
      forward({ from: readyToLoadSession, to: pageEvents });
    }

    const scope = fork(rootDomain);

    // Write cookies to each request to backend
    findEvent(scope, setCookiesForRequest)(req.cookies);

    try {
      await allSettled(startServer, {
        scope,
        params: undefined,
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

    const setCookie = findStore(scope, $cookiesFromResponse).getState();
    if (setCookie) {
      res.setHeader('Set-Cookie', setCookie);
    }

    const redirectUrl = findStore(scope, $lastPushed).getState();
    if (redirectUrl) {
      res.redirect(redirectUrl);
      console.info('[REDIRECT] to %s', redirectUrl);
      return;
    }

    const stream = sheet.interleaveWithNodeStream(
      ReactDOMServer.renderToNodeStream(jsx),
    );
    const storesValues = serialize(scope);

    res.write(htmlStart(assets.client.css, assets.client.js));
    stream.pipe(res, { end: false });
    stream.on('end', () => {
      res.end(htmlEnd(storesValues));
      clearNode(startServer);
      sheet.seal();
      console.info('[PERF] sent page at %sms', performance.now() - timeStart);
    });
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
