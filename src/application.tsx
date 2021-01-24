import * as React from 'react';
import { Scope } from 'effector/fork';
import { Provider, useEvent } from 'effector-react/ssr';

import { readyToLoadSession } from 'features/session';
import { Pages } from './pages';
import { Globals } from './globals';

interface Props {
  scope: Scope;
}

export const Application: React.FC<Props> = ({ scope }) => (
  <Provider value={scope}>
    <>
      <Globals />
      <Pages />
    </>
  </Provider>
);
