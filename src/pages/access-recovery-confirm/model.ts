import {
  createStore,
  createEvent,
  guard,
  sample,
  combine,
  createEffect,
  restore,
} from 'effector-root';

import { createStart } from 'lib/page-routing';

import { mapErrors, validatePassword } from './lib';

export interface ChangePasswordParams {
  password: string;
  code: string;
}

export const pageStart = createStart();

export const changePasswordFx = createEffect<ChangePasswordParams, void>();

export const passwordChanged = createEvent<string>();
export const rePasswordChanged = createEvent<string>();
export const passwordConfirmed = createEvent<boolean>();
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

$failure.on(passwordConfirmed, (_, isConfirmed) => {
  if (isConfirmed) return null;

  const errorMessage = mapErrors('invalid_password');

  return errorMessage;
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
  source: { password: $password, code: $code },
  clock: guard(formSubmitted, {
    filter: $isPasswordValid,
  }),
  target: changePasswordFx,
});
