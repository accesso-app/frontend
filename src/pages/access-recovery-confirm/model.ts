import {
  createStore,
  createEvent,
  guard,
  sample,
  combine,
  createEffect,
} from 'effector-root';
import { debug } from 'patronum/debug';

import { createStart } from 'lib/page-routing';

import { validatePassword } from './lib';

export interface ChangePasswordParams {
  password: string;
  code: string;
}

export const pageStart = createStart();

export const changePassword = createEffect<ChangePasswordParams, void>();

export const passwordChanged = createEvent<string>();
export const rePasswordChanged = createEvent<string>();
export const passwordConfirmed = createEvent<boolean>();
export const formSubmitted = createEvent();

const codeReceived = pageStart.filterMap(({ params }) => {
  console.log(params['code']); // выводит

  return params['code'];
});

export const $password = createStore<string>('');
export const $rePassword = createStore<string>('');
export const $failure = createStore<boolean>(false);
export const $code = createStore<string | null>(null);

const $isPasswordValid = $password.map((pass) => validatePassword(pass));

$password.on(passwordChanged, (_, password) => password);
$rePassword.on(rePasswordChanged, (_, password) => password);
$failure.on(passwordConfirmed, (_, isConfirmed) => !isConfirmed);
$code.on(codeReceived, (_, code) => {
  console.log(code); // выводит

  return code;
});

sample({
  source: combine([$password, $rePassword]),
  clock: formSubmitted,
  fn: ([password, rePassword]) => {
    const isEqual = password === rePassword;

    return isEqual;
  },
  target: passwordConfirmed,
});

sample({
  source: [$password, $rePassword, $code],
  clock: guard(formSubmitted, {
    filter: $isPasswordValid.map((isValid) => !!isValid),
  }),
  fn: ([password, , code]) => ({ password, code: code! }),
  target: changePassword,
});

debug($code, formSubmitted, codeReceived, pageStart);
