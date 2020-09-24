import {
  createEvent,
  createStore,
  createEffect,
  guard,
  sample,
  restore,
} from 'effector-root';

import { sendRecoveryEmail } from 'api/access-recovery';
import { validateEmail } from 'lib/email';

type AccessRecoveryError = 'invalid_email';

function mapErrors(error: AccessRecoveryError) {
  switch (error) {
    case 'invalid_email':
      return 'Email is invalid';
    default:
      return 'Oops, something went wrong';
  }
}

export const emailChanged = createEvent<string>();
export const formSubmitted = createEvent();

export const $email = restore<string>(emailChanged, '');
export const $failure = createStore<string | null>(null);

$email.on(emailChanged, (_, email) => email);

$failure.on(sendRecoveryEmail.failData, (_, data) => {
  const { error } = data.body;

  return mapErrors(error);
});

$failure.reset(formSubmitted);

sample({
  source: { email: $email },
  clock: guard(formSubmitted, { filter: $email.map((is) => !!is) }),
  target: sendRecoveryEmail,
});
