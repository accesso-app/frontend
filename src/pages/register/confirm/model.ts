import { attach, combine, createEvent, createStore, Event, sample } from 'effector';
import * as typed from 'typed-contracts';

import { checkAnonymous } from 'features/session';

import * as api from 'shared/api';
import { registerConfirmationBadRequest } from 'shared/api';
import { createStart } from 'shared/lib/page-routing';

const registerConfirmationFx = attach({ effect: api.registerConfirmation });

type BadRequestStatus = typed.Get<typeof registerConfirmationBadRequest>['error'];
type LocalErrors =
  | 'empty_first_name'
  | 'empty_last_name'
  | 'incorrect_password_repeat'
  | 'empty_password';

export const start = createStart();

export const formSubmitted = createEvent();
export const firstNameChanged = createEvent<string>();
export const lastNameChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const repeatChanged = createEvent<string>();

export const $isFormPending = registerConfirmationFx.pending;

export const $isRegistrationFinished = createStore(false);
export const $failure = createStore<null | BadRequestStatus | LocalErrors>(null);

const $code = start.$params.map((params) => params.code ?? '');

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

$isRegistrationFinished.reset(pageReady);
$firstName.reset(pageReady);
$lastName.reset(pageReady);
$password.reset(pageReady);
$repeat.reset(pageReady);
$failure.reset(pageReady);

$firstName.on(firstNameChanged, (_, name) => name);
$lastName.on(lastNameChanged, (_, name) => name);
$password.on(passwordChanged, (_, password) => password);
$repeat.on(repeatChanged, (_, confirmation) => confirmation);

$failure.on([firstNameChanged, lastNameChanged, passwordChanged, repeatChanged], () => null);

sample({
  source: $form,
  clock: formSubmitted,
  fn: (body) => ({ body }),
  filter: $isSubmitEnabled,
  target: registerConfirmationFx,
});

$failure
  .on(registerConfirmationFx, () => null)
  .on(registerConfirmationFx.failData, (_, failure) => {
    if ((failure.status as any as number) !== 400) {
      return 'internal_server_error';
    }

    return (failure as any).body.error;
  })
  .on(registerConfirmationFx, () => null);

registerConfirmationFx.failData.watch((f) => console.warn('registerConfirm FAIL', f));

$isRegistrationFinished.on(registerConfirmationFx.done, () => true);

// TODO: add error showing when formSubmitted but password incorrect or/and first last names empty

const emptyFirstName: Event<LocalErrors> = sample({
  source: $firstName,
  clock: formSubmitted,
  filter: (firstName) => firstName.trim().length < 2,
  fn: () => 'empty_first_name' as LocalErrors,
});

const emptyLastName: Event<LocalErrors> = sample({
  source: $lastName,
  clock: formSubmitted,
  filter: (lastName) => lastName.trim().length < 2,
  fn: () => 'empty_last_name' as LocalErrors,
});

const incorrectPassword: Event<LocalErrors> = sample({
  source: combine({ password: $password, repeat: $repeat }),
  clock: formSubmitted,
  filter: ({ password, repeat }) => password.length === 0 || password !== repeat,
  fn: ({ password, repeat }): LocalErrors =>
    password.length === 0 ? 'empty_password' : 'incorrect_password_repeat',
});

sample({
  clock: [incorrectPassword, emptyLastName, emptyFirstName],
  target: $failure,
});
