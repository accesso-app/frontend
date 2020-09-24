import { ChangeEvent } from 'react';
import {
  createEvent,
  createStore,
  createEffect,
  guard,
  sample,
} from 'effector-root';
import { validateEmail } from 'lib/validateEmail';
import { getErorr } from 'lib/get-error';

const request = createEffect<string, string>();

export const emailChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const formSubmitted = createEvent();

export const $email = createStore<string>('');
export const $failure = createStore<string | null>(null);

request.use((email) => {
  const isEmailValid = validateEmail(email);

  if (!isEmailValid) {
    throw new Error('Email is not valid');
  }

  console.log({
    recoveryUrl: `/access-recovery/confirm-code`,
  });

  return 'success';
});

$email.on(emailChanged, (_, email) => email.currentTarget.value);

$failure.on(request.failData, () => {
  const errorMessage = getErorr(1000);

  return errorMessage;
});

$failure.reset(formSubmitted);

sample({
  source: $email,
  clock: guard(formSubmitted, { filter: $email.map((is) => !!is) }),
  target: request,
});
