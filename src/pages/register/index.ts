import { contract } from 'shared/lib/contract';
import { withStart } from 'shared/lib/page-routing';

import * as model from './model';
import * as page from './page';

export const RegisterPage = withStart(model.start, page.RegisterPage);

contract({
  model,
  page,
});
