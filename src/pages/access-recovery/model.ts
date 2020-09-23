import {
  createEvent,
  createStore,
  createEffect,
  guard,
  sample,
  restore,
} from 'effector-root';

import { validateEmail } from 'lib/email';

export const sendEmailFx = createEffect<string, string>();

export const emailChanged = createEvent<string>();
export const formSubmitted = createEvent();

export const $email = restore<string>(emailChanged, '');
export const $failure = createStore<boolean>(false);

sendEmailFx.use((email) => {
  const isEmailValid = validateEmail(email);

  if (!isEmailValid) {
    throw Error('email is not vlaid');
  }

  console.log({
    recoveryUrl: `/access-recovery/confirm-code`,
  });

  return 'success';
});

$failure.on(sendEmailFx.fail, () => true);
$failure.reset(formSubmitted);

sample({
  source: $email,
  clock: guard(formSubmitted, { filter: $email.map((is) => !!is) }),
  target: sendEmailFx,
});
