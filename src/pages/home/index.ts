import { contract } from 'shared/lib/contract';

import * as model from './model';
import * as page from './page';

export { HomePage } from './page';

contract({
  page,
  model: {
    ...model,
    logoutClicked: model.logout.prepend(noop),
  },
});

function noop(): void {}
