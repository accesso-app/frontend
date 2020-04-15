import { ChangeEvent } from 'react';
import { createEvent, createStore, sample, combine, guard } from 'lib/effector';
import {} from 'api/session';

// import { checkAuthenticated } from 'features/session'

export const pageLoaded = createEvent();

export const formSubmitted = createEvent();
export const emailChanged = createEvent<ChangeEvent<HTMLInputElement>>();

export const $formDisabled = createStore(false); //sessionCreate.pending;

export const $email = createStore<string>('');

export const $isEmailValid = $email.map(
  (email) => email.includes('@') && email.length > 5,
);

// checkAuthenticated({ on: pageLoaded })

$email.on(emailChanged, (_, event) => event.currentTarget.value);
