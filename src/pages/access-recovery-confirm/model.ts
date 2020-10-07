import { debug } from 'patronum';
import {
  createStore,
  createEvent,
  guard,
  sample,
  createEffect,
  restore,
  forward,
} from 'effector-root';

import { createStart } from 'lib/page-routing';
import { validatePassword } from 'lib/password';
import { changePassword } from 'api/access-recovery';

export interface ChangePasswordParams {
  password: string;
  code: string;
}

export type AccessRecoveryConfirmError =
  | 'password_too_short'
  | 'repeat_password_wrong'
  | 'invalid_email'
  | 'invalid_password'
  | 'fail_to_parse'
  | null;

export const pageStart = createStart();

export const passwordChanged = createEvent<string>();
export const rePasswordChanged = createEvent<string>();
export const formSubmitted = createEvent();

const codeReceived = pageStart.filterMap(({ params }) => {
  const { code } = params;

  return code;
});

export const $password = restore<string>(passwordChanged, '');
export const $rePassword = restore<string>(rePasswordChanged, '');
export const $code = restore<string>(codeReceived, null);
export const $failure = createStore<AccessRecoveryConfirmError>(null);

const $isPasswordValid = $password.map((pass) => validatePassword(pass));
$failure.on(changePassword.failInvalid, () => 'fail_to_parse');

sample({
  source: [$password, $rePassword],
  clock: formSubmitted,
  fn: ([password, rePassword]) => {
    const isEqual = password === rePassword;
    const hasEightLetters = password.length >= 8;

    switch (true) {
      case !hasEightLetters:
        return 'password_too_short';
      case !isEqual:
        return 'repeat_password_wrong';
      default:
        return null;
    }
  },
  target: $failure,
});

sample({
  source: { password: $password, code: $code },
  clock: guard(formSubmitted, {
    filter: $isPasswordValid,
  }),
  target: changePassword,
});

forward({
  from: changePassword.fail.map(({ error }) => {
    const errorCode = error.body.error;

    return errorCode;
  }),
  to: $failure,
});
