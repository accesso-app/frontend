import {
  createEvent,
  createStore,
  createEffect,
  guard,
  sample,
  restore,
} from 'effector-root';

export const sendEmailFx = createEffect();

export const emailChanged = createEvent<string>();
export const formSubmitted = createEvent();

export const $email = restore<string>(emailChanged, '');
export const $failure = createStore<boolean>(false);

sendEmailFx.use((email) => {
  if (email !== 'valid@email.com') {
    throw Error('123');
  }

  return 'success';
});

$failure.on(sendEmailFx.fail, () => true);
$failure.reset(formSubmitted);

sample({
  source: $email,
  clock: guard(formSubmitted, { filter: $email.map((is) => !!is) }),
  target: sendEmailFx,
});
