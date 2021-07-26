import * as React from 'react';
import { Scope } from 'effector/fork';
import { Provider } from 'effector-react/ssr';

import { Route } from 'react-router';
import { QueryParamProvider } from 'use-query-params';
import { Pages } from './pages';
import { Globals } from './globals';

interface Props {
  scope: Scope;
}

export const Application: React.FC<Props> = ({ scope }) => (
  <QueryParamProvider ReactRouterRoute={Route}>
    <Provider value={scope}>
      <>
        <Globals />
        <Pages />
      </>
    </Provider>
  </QueryParamProvider>
);
