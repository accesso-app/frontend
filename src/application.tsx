import * as React from 'react';
import { Scope } from 'effector/fork';
import { Provider } from 'effector-react/ssr';

import { Pages } from './pages';
import { Globals } from './globals';

interface Props {
  root: Scope;
}

export const Application: React.FC<Props> = ({ root }) => (
  <Provider value={root}>
    <>
      <Globals />
      <Pages />
    </>
  </Provider>
);
