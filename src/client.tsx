import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { matchRoutes } from 'react-router-config';
import { forward, root } from 'effector-root';
import { fork } from 'effector/fork';

import { getStart, lookupStartEvent, routeWithEvent } from 'lib/page-routing';
import { history, historyChanged } from 'features/navigation';
import { routes } from 'pages/routes';
import { Application } from './application';

const routesMatched = historyChanged.map((change) => ({
  routes: matchRoutes(routes, change.pathname).filter(lookupStartEvent),
  query: Object.fromEntries(new URLSearchParams(change.search)),
}));

for (const { component, path } of routes) {
  const startPageEvent = getStart(component);
  if (!startPageEvent) {
    console.log('no startPage event', component, path);
    continue;
  }

  const matchedRoute = routesMatched.filterMap(({ routes, query }) => {
    const route = routes.find(routeWithEvent(startPageEvent));
    if (route) return { route, query };
    return undefined;
  });

  forward({
    from: matchedRoute,
    to: startPageEvent.prepend(({ route, query }) => ({
      params: route.match.params,
      query,
    })),
  });
}
const scope = fork(root, { values: INITIAL_STATE });

ReactDOM.hydrate(
  <Router history={history!}>
    <Application scope={scope} />
  </Router>,
  document.querySelector('#root'),
);

if (module.hot) {
  module.hot.accept();
}
