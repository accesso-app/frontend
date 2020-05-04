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
import { StartParams } from 'lib/page-routing';

export const pageLoaded = createEvent<StartParams>();

export const formSubmitted = createEvent<FormEvent<HTMLFormElement>>();
export const emailChanged = createEvent<ChangeEvent<HTMLInputElement>>();

export const $emailSubmitted = createStore(false);
export const $failure = createStore<
  null | 'email_already_registered' | 'invalid_form' | 'invalid_payload'
>(null);

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

$failure
  .on(pageReady, () => null)
  .on(registerRequest, () => null)
  .on(registerRequest.failBody, (_, { error }) => error);

guard({
  source: sample($form, formSubmitted),
  filter: $isSubmitEnabled,
  target: registerRequest,
});
