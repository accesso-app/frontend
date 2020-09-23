import { ChangeEvent } from 'react';
import {
  createEvent,
  createStore,
  createEffect,
  guard,
  sample,
} from 'effector-root';
import { validateEmail } from 'lib/validateEmail';

const request = createEffect<string, string>();

export const emailChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const formSubmitted = createEvent();

export const $email = createStore<string>('');
export const $failure = createStore<boolean>(false);

request.use((email) => {
  const isEmailValid = validateEmail(email);

  if (!isEmailValid) {
    throw Error('email is not vlaid');
  }

  console.log({
    recoveryUrl: `/access-recovery/confirm-code`,
  });

  return 'success';
});

$email.on(emailChanged, (_, email) => email.currentTarget.value);

$failure.on(request.fail, () => true);
$failure.reset(formSubmitted);

sample({
  source: $email,
  clock: guard(formSubmitted, { filter: $email.map((is) => !!is) }),
  target: request,
});
