import { ChangeEvent, FormEvent } from 'react';
import {
  combine,
  createEvent,
  createStore,
  guard,
  sample,
} from 'effector-root';
import { registerRequest } from 'api/register';

import { checkAnonymous } from 'features/session';

export const pageLoaded = createEvent<Record<string, string>>();

export const formSubmitted = createEvent<FormEvent<HTMLFormElement>>();
export const emailChanged = createEvent<ChangeEvent<HTMLInputElement>>();

export const $emailSubmitted = createStore(false);
export const $failure = createStore(null);

export const $formPending = registerRequest.pending;

export const $email = createStore<string>('');
export const $isEmailValid = $email.map(
  (email) => email.includes('@') && email.length > 5,
);

export const $isSubmitEnabled = combine(
  $formPending,
  $isEmailValid,
  (pending, valid) => !pending && valid,
);

const $form = combine($email, (email) => ({ email }));

const pageReady = checkAnonymous({ when: pageLoaded });

$emailSubmitted
  .on(pageReady, () => false)
  .on(registerRequest.done, () => true)
  .on(registerRequest.fail, () => false);

$email.on(emailChanged, (_, event) => event.currentTarget.value);

guard({
  source: sample($form, formSubmitted),
  filter: $isSubmitEnabled,
  target: registerRequest,
});
