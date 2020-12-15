import {
  createEvent,
  createDomain,
  sample,
  combine,
  guard,
  forward,
  attach,
} from 'effector-root';
import { pending } from 'patronum/pending';
import { sessionCreate, sessionGet } from 'api/session';

import { checkAnonymous } from 'features/session';
import { historyPush } from 'features/navigation';
import { path } from 'pages/paths';
import { Failure } from './types';

export const start = createEvent();
export const formSubmit = createEvent();
export const emailChange = createEvent<string>();
export const passwordChange = createEvent<string>();

const pageReady = checkAnonymous({ when: start });

// TODO: migrate from `createResource` to `effector-openapi-preset`
const sessionCreateLocal = attach({ effect: sessionCreate });
const sessionGetLocal = attach({ effect: sessionGet });

export const $formPending = pending({
  effects: [sessionCreateLocal, sessionGetLocal],
});
export const $formDisabled = $formPending;
const form = createDomain();

export const $email = form.createStore<string>('');
export const $password = form.createStore<string>('');
export const $failure = form.createStore<Failure | null>(null);

const $form = combine({ email: $email, password: $password });

form.onCreateStore(($store) => $store.reset(start));

$email.on(emailChange, (_, email) => email);
$password.on(passwordChange, (_, password) => password);

$failure
  .reset(pageReady, sessionCreate)
  .on(sessionCreate.failBody, (_, failed) => {
    if ('error' in failed) {
      return failed.error;
    }
    return 'unexpected';
  });

sample({
  source: $form,
  clock: guard(formSubmit, { filter: $formDisabled.map((is) => !is) }),
  target: sessionCreateLocal,
});

forward({
  from: sessionCreateLocal.done,
  to: sessionGetLocal,
});

forward({
  from: sessionGetLocal.done,
  to: historyPush.prepend(path.home),
});
