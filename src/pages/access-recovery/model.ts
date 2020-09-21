import { ChangeEvent } from 'react';
import {
  createEvent,
  createStore,
  createEffect,
  guard,
  sample,
} from 'effector-root';

const request = createEffect();

export const emailChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const formSubmitted = createEvent();

export const $email = createStore<string>('');
export const $failure = createStore<boolean>(false);

request.use((email) => {
  if (email !== 'valid@email.com') {
    throw Error('123');
  }

  return 'success';
});

$email.on(emailChanged, (_, email) => email.currentTarget.value);

$failure.on(request.fail, () => true);
$failure.reset(formSubmitted);

sample({
  source: $email,
  clock: guard(formSubmitted, { filter: $email.map((is) => !!is) }),
  target: request,
});
