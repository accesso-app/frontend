import { contract } from 'shared/lib/contract';
import { getValue } from 'shared/lib/input';

import * as model from './model';
import * as page from './page';

export { AccessRecoveryConfirmPage } from './page';

contract({
  page,
  model: {
    ...model,
    passwordChanged: model.passwordChanged.prepend(getValue),
    rePasswordChanged: model.rePasswordChanged.prepend(getValue),
    formSubmitted: model.formSubmitted.prepend(() => {}),
  },
});
