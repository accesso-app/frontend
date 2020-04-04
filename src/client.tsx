import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { fork, hydrate } from 'effector/fork';

import { rootDomain } from 'lib/effector';
import { history } from 'features/navigation';
import { Application } from './application';

hydrate(rootDomain, { values: INITIAL_STATE });

const scope = fork(rootDomain);

ReactDOM.hydrate(
  <Router history={history!}>
    <Application root={scope} />
  </Router>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
