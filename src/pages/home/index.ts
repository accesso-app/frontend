import { contract } from 'lib/contract';
import * as page from './page';
import * as model from './model';

export { HomePage } from './page';

contract({
  page,
  model: {
    ...model,
    logoutClicked: model.logout.prepend(noop),
  },
});

function noop(): void {}
