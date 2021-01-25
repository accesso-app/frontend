import {
  attach,
  combine,
  createDomain,
  createEvent,
  forward,
  guard,
  sample,
} from 'effector-root';
import { pending } from 'patronum/pending';

import * as api from 'api';
import { createStart } from 'lib/page-routing';
import { path } from 'pages/paths';
import { checkAnonymous } from 'features/session';
import { historyPush } from 'features/navigation';

import { Failure } from './types';

const sessionCreateFx = attach({ effect: api.sessionCreate });
const sessionGetFx = attach({ effect: api.sessionGet });

export const pageStarted = createStart();
export const formSubmit = createEvent();
export const emailChange = createEvent<string>();
export const passwordChange = createEvent<string>();

const pageReady = checkAnonymous({ when: pageStarted });

export const $formPending = pending({
  effects: [sessionCreateFx, sessionGetFx],
});
export const $formDisabled = $formPending;
const formDomain = createDomain();

export const $email = formDomain.createStore<string>('');
export const $password = formDomain.createStore<string>('');
export const $error = formDomain.createStore<Failure | null>(null);

const $form = combine({ email: $email, password: $password });

formDomain.onCreateStore(($store) => $store.reset(pageReady));

$email.on(emailChange, (_, email) => email);
$password.on(passwordChange, (_, password) => password);

$error
  .reset(pageReady, sessionCreateFx)
  .on(sessionCreateFx.failData, (_, failed) => {
    if (failed.status === 'bad_request') {
      return failed.error.error;
    }
    return 'unexpected';
  });

sample({
  source: $form.map((body) => ({ body })),
  clock: guard(formSubmit, { filter: $formDisabled.map((is) => !is) }),
  target: sessionCreateFx,
});

forward({ from: sessionCreateFx.done, to: sessionGetFx });

forward({ from: sessionGetFx.done, to: historyPush.prepend(path.home) });
