import { debug } from 'patronum';
import {
  createStore,
  createEvent,
  guard,
  sample,
  createEffect,
} from 'effector-root';

import { createStart } from 'lib/page-routing';

import { getErorr, validatePassword } from './lib';

export interface ChangePasswordParams {
  password: string;
  code: string;
}

export const pageStart = createStart();

export const changePassword = createEffect<ChangePasswordParams, void>();

export const passwordChanged = createEvent<string>();
export const rePasswordChanged = createEvent<string>();
export const formSubmitted = createEvent();

const codeReceived = pageStart.filterMap(({ params }) => params['code']);

export const $password = createStore<string>('');
export const $rePassword = createStore<string>('');
export const $failure = createStore<string | null>(null);
export const $code = createStore<string | null>(null);

const $isPasswordValid = $password.map((pass) => validatePassword(pass));

$password.on(passwordChanged, (_, password) => password);
$rePassword.on(rePasswordChanged, (_, password) => password);
$code.on(codeReceived, (_, code) => code);

sample({
  source: [$password, $rePassword],
  clock: formSubmitted,
  fn: ([password, rePassword]) => {
    const isEqual = password === rePassword;
    const hasEightLetters = password.length >= 8;

    if (!hasEightLetters) {
      return 'Password should be at least 8 letters long';
    }

    if (!isEqual) {
      const errorMessage = getErorr(1000);

      return errorMessage;
    }

    return null;
  },
  target: $failure,
});

sample({
  source: [$password, $rePassword, $code],
  clock: guard(formSubmitted, {
    filter: $isPasswordValid.map((isValid) => !!isValid),
  }),
  fn: ([password, , code]) => ({ password, code: code! }),
  target: changePassword,
});

debug(formSubmitted, $failure);
