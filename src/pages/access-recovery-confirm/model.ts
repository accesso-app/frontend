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

type AccessRecoveryConfirmError = 'invalid_email' | 'invalid_password';

function mapErrors(error: AccessRecoveryConfirmError) {
  switch (error) {
    case 'invalid_email':
      return 'Email is invalid';
    case 'invalid_password':
      return 'Password is invalid';
    default:
      return 'Oops, something went wrong';
  }
}

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
export const $failure = createStore<string | null>('');

const $isPasswordValid = $password.map((pass) => validatePassword(pass));

sample({
  source: [$password, $rePassword],
  clock: formSubmitted,
  fn: ([password, rePassword]) => {
    const isEqual = password === rePassword;
    const hasEightLetters = password.length >= 8;

    switch (true) {
      case !hasEightLetters:
        return 'Password should be at least 8 letters long';
      case !isEqual:
        return 'Passwords do not match';
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
  from: changePassword.failData.map(({ body }) => {
    const error = body.error;

    return mapErrors(error);
  }),
  to: $failure,
});
