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
import { createStart } from 'lib/page-routing';

export type AccessRecoveryError = 'invalid_email' | 'fail_to_parse' | null;

export const pageLoaded = createStart();
export const emailChanged = createEvent<string>();
export const formSubmitted = createEvent();

export const $email = restore<string>(emailChanged, '');
export const $failure = createStore<AccessRecoveryError>(null);

$email.on(emailChanged, (_, email) => email);

$failure
  .reset(formSubmitted, pageLoaded)
  .on(sendRecoveryEmail.failData, (_, { body }) => body.error)
  .on(sendRecoveryEmail.failInvalid, () => 'fail_to_parse')
  .on(emailChanged, (_, email) => {
    const isValid = validateEmail(email);
    if (isValid) return;
    return 'invalid_email';
  });

sample({
  source: { email: $email },
  clock: guard(formSubmitted, { filter: $email.map((is) => !!is) }),
  target: sendRecoveryEmail,
});
