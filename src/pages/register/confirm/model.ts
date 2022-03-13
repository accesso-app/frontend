import { combine, createEvent, createStore, guard, sample, Store, Event } from 'effector';
import * as typed from 'typed-contracts';

import { checkAnonymous } from 'features/session';

import { registerConfirmation, registerConfirmationBadRequest } from 'shared/api';
import { createStart } from 'shared/lib/page-routing';

type BadRequestStatus = typed.Get<typeof registerConfirmationBadRequest>['error'];
type LocalErrors = 'empty_first_name' | 'empty_last_name' | 'incorrect_password_repeat';

export const start = createStart();
const codeReceived = start.filterMap(({ params }) => params.code);

export const formSubmitted = createEvent();
export const firstNameChanged = createEvent<string>();
export const lastNameChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const repeatChanged = createEvent<string>();

export const $isFormPending = registerConfirmation.pending;

export const $isFormChanged = createStore(false);
export const $isRegistrationFinished = createStore(false);
export const $failure = createStore<null | BadRequestStatus | LocalErrors>(null);

export const $code = createStore('');

export const $firstName = createStore<string>('');
export const $lastName = createStore<string>('');
export const $password = createStore<string>('');
export const $repeat = createStore<string>('');

export const $displayName = combine([$firstName, $lastName], (names) => names.join(' '));

const $isDisplayNameValid = combine(
  $firstName,
  $lastName,
  (first, last) => first.trim().length > 1 && last.trim().length > 1,
);

const $isPasswordValid = combine(
  $password,
  $repeat,
  (password, repeat) => password.length >= 8 && password === repeat,
);

export const $isSubmitEnabled = combine(
  $isDisplayNameValid,
  $isPasswordValid,
  (nameValid, passwordValid) => nameValid && passwordValid,
);

const $form = combine({
  confirmationCode: $code,
  firstName: $firstName,
  lastName: $lastName,
  password: $password,
});

const pageReady = checkAnonymous({ when: start });

$code.on(codeReceived, (_, code) => code);

$isRegistrationFinished.on(pageReady, () => false).on(registerConfirmation.done, () => true);

$firstName.on(firstNameChanged, (_, name) => name);
$lastName.on(lastNameChanged, (_, name) => name);
$password.on(passwordChanged, (_, password) => password);
$repeat.on(repeatChanged, (_, confirmation) => confirmation);

$failure.on([firstNameChanged, lastNameChanged, passwordChanged, repeatChanged], () => null);

$failure
  .on(pageReady, () => null)
  .on(registerConfirmation, () => null)
  .on(registerConfirmation.failData, (_, failure) => {
    if ((failure.status as any as number) !== 400) {
      return null;
    }

    return (failure as any).body.error;
  });

registerConfirmation.failData.watch((f) => console.warn('registerConfirm FAIL', f));

guard({
  source: sample({
    source: $form,
    clock: formSubmitted,
    fn: (body) => ({ body }),
  }),
  filter: $isSubmitEnabled,
  target: registerConfirmation,
});

// TODO: add error showing when formSubmitted but password incorrect or/and first last names empty
