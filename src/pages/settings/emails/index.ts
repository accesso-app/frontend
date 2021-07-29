import { sample } from 'effector-root';
import { contract } from 'lib/contract';
import * as model from './model';
import * as page from './page';

export { EmailsProfilePage } from './page';

sample({
  clock: page.newEmailChanged,
  fn: (e) => e.target.value,
  target: model.changeEmail,
});
contract({
  page,
  model: {
    ...model,
    formSubmitted: model.submitForm.prepend(() => undefined),
    $userNewEmail: model.$newEmail,
    passwordChanged: model.changePassword.prepend((e) => e.target.value),
    newEmailChanged: model.changeEmail.prepend((e) => e.target.value),
  },
});
