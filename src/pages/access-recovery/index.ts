import { contract } from 'lib/contract';
import { getValue } from 'lib/input';
import * as model from './model';
import * as page from './page';

export { AccessRecoveryPage } from './page';

contract({
  page,
  model: {
    ...model,
    emailChanged: model.emailChanged.prepend(getValue),
    formSubmitted: model.formSubmitted.prepend(() => {}),
    $error: model.$failure,
  },
});
