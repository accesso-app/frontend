import { contract } from 'shared/lib/contract';
import { withStart } from 'shared/lib/page-routing';

import * as model from './model';
import * as page from './page';

contract({
  page,
  model: {
    ...model,
    logoutClicked: model.logoutClicked.prepend(noop),
  },
});

export const HomePage = withStart(model.pageStarted, page.HomePage);

function noop(): void {}
