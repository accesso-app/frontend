import { ChangeEvent } from 'react';
import {
  combine,
  createEvent,
  createStore,
  forward,
  guard,
  sample,
} from 'effector-root';
import { registerConfirmation } from 'api/register';
import { historyPush } from 'features/navigation';
import { path } from 'pages/paths';

// import { checkAuthenticated } from 'features/session'

export const pageLoaded = createEvent<Record<string, string>>();
const codeReceived = pageLoaded.filterMap((params) => params['code']);

export const formSubmitted = createEvent();
export const displayNameChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const passwordChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const repeatChanged = createEvent<ChangeEvent<HTMLInputElement>>();

export const $isFormPending = registerConfirmation.pending;

export const $isRegistrationFinished = createStore(false);

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

// checkAuthenticated({ on: pageLoaded })

$code.on(codeReceived, (_, code) => code);

$isRegistrationFinished
  .on(pageLoaded, () => false)
  .on(registerConfirmation.done, () => true);

$displayName.on(displayNameChanged, (_, event) => event.currentTarget.value);
$password.on(passwordChanged, (_, event) => event.currentTarget.value);
$repeat.on(repeatChanged, (_, event) => event.currentTarget.value);

guard({
  source: sample($form, formSubmitted),
  filter: $isSubmitDisabled.map((is) => !is),
  target: registerConfirmation,
});
