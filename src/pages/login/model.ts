import { ChangeEvent } from 'react';
import {
  createEvent,
  createStore,
  sample,
  combine,
  guard,
} from 'effector-root';
import { sessionCreate } from 'api/session';

import { checkAnonymous } from 'features/session';
import { StartParams } from 'lib/page-routing';

export const pageLoaded = createEvent<StartParams>();

export const formSubmitted = createEvent();
export const emailChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const passwordChanged = createEvent<ChangeEvent<HTMLInputElement>>();

export const $formDisabled = sessionCreate.pending;

export const $email = createStore<string>('');
export const $password = createStore<string>('');

export const $failure = createStore<string | null>(null);

const $form = combine({ email: $email, password: $password });

const pageReady = checkAnonymous({ when: pageLoaded });

$email.on(emailChanged, (_, event) => event.currentTarget.value);
$password.on(passwordChanged, (_, event) => event.currentTarget.value);

$failure
  .on(sessionCreate, () => null)
  .on(pageReady, () => null)
  .on(sessionCreate.failBody, (_, failed) => {
    if ('error' in failed) {
      return failed.error;
    }
    return 'unexpected';
  });

sample({
  source: $form,
  clock: guard(formSubmitted, { filter: $formDisabled.map((is) => !is) }),
  target: sessionCreate,
});
