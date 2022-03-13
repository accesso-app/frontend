import { contract } from 'shared/lib/contract';
import { withStart } from 'shared/lib/page-routing';

import * as model from './model';
import * as page from './page';

contract({
  model,
  page,
});

export const RegisterConfirmPage = withStart(model.start, page.RegisterConfirmPage);
