import { Scope } from 'effector';
import { Provider } from 'effector-react/ssr';
import * as React from 'react';

import { Pages } from '../pages';
import { Globals } from './globals';
import './main.css';

interface Props {
  scope: Scope;
}

export const Application: React.FC<Props> = ({ scope }) => (
  <Provider value={scope}>
    <>
      <div className="inline-block h-5 w-3 bg-red-400 hover:shadow-md" />
      <Globals />
      <Pages />
    </>
  </Provider>
);
