import { ChangeEvent, FormEvent } from 'react';
import { combine, createEvent, createStore, guard } from 'effector';
import { registerRequest } from 'api';

import { checkAnonymous } from 'features/session';
import { createStart } from 'lib/page-routing';

export type RegisterFailure =
  | 'email_already_registered'
  | 'invalid_form'
  | 'invalid_payload';

export const pageLoaded = createStart();

export const formSubmitted = createEvent<FormEvent<HTMLFormElement>>();
export const emailChanged = createEvent<ChangeEvent<HTMLInputElement>>();
const changedEmail = emailChanged.map((event) => event.currentTarget.value);

export const $emailSubmitted = createStore(false);
export const $failure = createStore<RegisterFailure | null>(null);

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

const $form = combine({ email: $email });

const pageReady = checkAnonymous({ when: pageLoaded });

$emailSubmitted.on(pageReady, () => false);
$failure.on(pageReady, () => null);

$email.on(changedEmail, (_, email) => email);

guard({
  clock: formSubmitted,
  source: $form,
  filter: $isSubmitEnabled,
  target: registerRequest.prepend((body: { email: string }) => ({ body })),
});

$failure.on(registerRequest, () => null);
$emailSubmitted.on(registerRequest.done, () => true);

$emailSubmitted.on(registerRequest.fail, () => false);
$failure.on(registerRequest.failData, (_, failure) => {
  if (failure.status !== 'bad_request') {
    return null;
  }

  return failure.error.error;
});
