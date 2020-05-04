import { ChangeEvent } from 'react';
import {
  combine,
  createEvent,
  createStore,
  guard,
  sample,
} from 'effector-root';
import { registerConfirmation } from 'api/register';

import { checkAnonymous } from 'features/session';
import { createStart } from 'lib/page-routing';

export const pageStart = createStart();
const codeReceived = pageStart.filterMap(({ params }) => params['code']);

export const formSubmitted = createEvent();
export const displayNameChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const passwordChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const repeatChanged = createEvent<ChangeEvent<HTMLInputElement>>();

export const $isFormPending = registerConfirmation.pending;

export const $isRegistrationFinished = createStore(false);
export const $failure = createStore<
  | null
  | 'code_invalid_or_expired'
  | 'email_already_activated'
  | 'invalid_form'
  | 'invalid_payload'
>(null);

export const $code = createStore('');

export const $displayName = createStore<string>('');
export const $password = createStore<string>('');
export const $repeat = createStore<string>('');

const $pairs = $displayName.map((name) =>
  name.replace(/\s+/, ' ').trim().split(' '),
);

// TODO: handle error to show in page

const $firstName = $pairs.map((pairs) => pairs[0].trim() ?? '');
const $lastName = $pairs.map(([, ...last]) => last.join(' ').trim() ?? '');

export const $isDisplayNameValid = combine(
  [$firstName, $lastName],
  ([first, last]) => first.length > 1 && last.length > 1,
);

export const $isPasswordValid = combine(
  [$password, $repeat],
  ([password, repeat]) => password === repeat,
);

export const $isSubmitDisabled = combine(
  $isDisplayNameValid,
  $isPasswordValid,
  (isName, isPassw) => !isName || !isPassw,
);

const $form = combine({
  confirmationCode: $code,
  firstName: $firstName,
  lastName: $lastName,
  password: $password,
});

const pageReady = checkAnonymous({ when: pageStart });

$code.on(codeReceived, (_, code) => code);

$isRegistrationFinished
  .on(pageReady, () => false)
  .on(registerConfirmation.done, () => true);

$displayName.on(displayNameChanged, (_, event) => event.currentTarget.value);
$password.on(passwordChanged, (_, event) => event.currentTarget.value);
$repeat.on(repeatChanged, (_, event) => event.currentTarget.value);

$failure
  .on(pageReady, () => null)
  .on(registerConfirmation, () => null)
  .on(registerConfirmation.failBody, (_, { error }) => error);

guard({
  source: sample($form, formSubmitted),
  filter: $isSubmitDisabled.map((is) => !is),
  target: registerConfirmation,
});
