import { ChangeEvent } from 'react';
import { createEvent, createStore, sample, combine, guard } from 'lib/effector';
import {} from 'api/session';

// import { checkAuthenticated } from 'features/session'

export const pageLoaded = createEvent();

export const formSubmitted = createEvent();
export const displayNameChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const passwordChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const repeatChanged = createEvent<ChangeEvent<HTMLInputElement>>();

export const $formDisabled = createStore(false); //sessionCreate.pending;

export const $displayName = createStore<string>('');
export const $password = createStore<string>('');
export const $repeat = createStore<string>('');

const $pairs = $displayName.map((name) =>
  name.replace(/\s+/, ' ').trim().split(' '),
);

const $firstName = $pairs.map((pairs) => pairs[0].trim() ?? '');
const $lastName = $pairs.map(([, ...last]) => last.join(' ').trim() ?? '');

const $form = combine({
  firstName: $firstName,
  lastName: $lastName,
  password: $password,
});

export const $isDisplayNameValid = combine(
  [$firstName, $lastName],
  ([first, last]) => first.length > 1 && last.length > 1,
);

export const $isPasswordValid = combine(
  [$password, $repeat],
  ([password, repeat]) => password === repeat,
);

// checkAuthenticated({ on: pageLoaded })

$displayName.on(displayNameChanged, (_, event) => event.currentTarget.value);
$password.on(passwordChanged, (_, event) => event.currentTarget.value);
$repeat.on(repeatChanged, (_, event) => event.currentTarget.value);
