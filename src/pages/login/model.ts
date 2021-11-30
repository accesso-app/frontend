import {
  attach,
  combine,
  createDomain,
  createEvent,
  createStore,
  forward,
  guard,
  merge,
  sample,
} from 'effector';
import { pending } from 'patronum/pending';

import { path } from 'pages/paths';

import { historyPush } from 'features/navigation';
import { OAuthSettings } from 'features/oauth';
import { checkAnonymous } from 'features/session';

import * as api from 'shared/api';

import { createStart, StartParams } from 'lib/page-routing';

import { Failure } from './types';

interface RedirectParams {
  url: string;
}

const sessionCreateFx = attach({ effect: api.sessionCreate });
const sessionGetFx = attach({ effect: api.sessionGet });

export const queryParamsCheck = createEvent<StartParams>();
export const redirectCheck = createEvent<OAuthSettings | null>();
export const pageStarted = createStart();
export const formSubmit = createEvent();
export const emailChange = createEvent<string>();
export const passwordChange = createEvent<string>();
export const $redirectParams = createStore<RedirectParams | null>(null);

const pageReady = checkAnonymous({ when: pageStarted, stop: queryParamsCheck });

$redirectParams.on(pageStarted, (state, params) => queryParamsToLoginParams(params.query));

const redirectBack = guard({
  source: merge([queryParamsCheck, sessionGetFx.done]),
  filter: $redirectParams.map((params) => Boolean(params)),
});

guard({
  source: queryParamsCheck,
  filter: $redirectParams.map((params) => !params),
  target: historyPush.prepend(path.home),
});

guard({
  source: sessionGetFx.done,
  filter: $redirectParams.map((params) => !params),
  target: historyPush.prepend(path.home),
});

sample({
  source: $redirectParams,
  clock: redirectBack,
  target: historyPush,
  fn: (redirectParams: RedirectParams | null) => redirectParams!.url,
});

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

$error.reset(pageReady, sessionCreateFx).on(sessionCreateFx.failData, (_, failed) => {
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

forward({
  from: sessionCreateFx.done,
  to: sessionGetFx,
});

function queryParamsToLoginParams(queryParams: Record<string, string>): RedirectParams | null {
  if (!queryParams.redirectBackUrl) {
    return null;
  }
  return {
    url: queryParams.redirectBackUrl,
  };
}
