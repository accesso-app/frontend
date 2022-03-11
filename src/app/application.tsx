import { Scope } from 'effector';
import { Provider } from 'effector-react/ssr';
import * as React from 'react';

import { Pages } from '../pages';
import './application.css';

interface Props {
  scope: Scope;
}

export const Application: React.FC<Props> = ({ scope }) => (
  <Provider value={scope}>
    <Pages />
  </Provider>
);
