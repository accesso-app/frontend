import { ChangeEvent, FormEvent } from 'react';
import {
  combine,
  createEvent,
  createStore,
  guard,
  sample,
} from 'effector-root';
import { registerRequest } from 'api/register';

// import { checkAuthenticated } from 'features/session'

export const pageLoaded = createEvent();

export const formSubmitted = createEvent<FormEvent<HTMLFormElement>>();
export const emailChanged = createEvent<ChangeEvent<HTMLInputElement>>();

export const $formDisabled = registerRequest.pending;

export const $email = createStore<string>('');

export const $isEmailValid = $email.map(
  (email) => email.includes('@') && email.length > 5,
);

const $form = combine($email, (email) => ({ email }));

// checkAuthenticated({ on: pageLoaded })

$email.on(emailChanged, (_, event) => event.currentTarget.value);

guard({
  source: sample($form, formSubmitted),
  filter: $formDisabled.map((is) => !is),
  target: registerRequest,
});
