import {
  attach,
  combine,
  createDomain,
  createEvent,
  forward,
  guard,
  merge,
  sample,
} from 'effector';
import { pending } from 'patronum/pending';

import { historyPush } from 'features/navigation';
import { OAuthSettings } from 'features/oauth';
import { checkAnonymous } from 'features/session';

import * as api from 'shared/api';
import { createStart, StartParams } from 'shared/lib/page-routing';
import { path } from 'shared/paths';

import { Failure } from './types';

interface RedirectParams {
  url: string;
}

const sessionCreateFx = attach({ effect: api.sessionCreate });
const sessionGetFx = attach({ effect: api.sessionGet });

export const start = createStart();

export const queryParamsCheck = createEvent<StartParams>();
export const redirectCheck = createEvent<OAuthSettings | null>();
export const formSubmit = createEvent();
export const emailChange = createEvent<string>();
export const passwordChange = createEvent<string>();
export const $redirectParams = start.$query.map(queryParamsToLoginParams);

const pageReady = checkAnonymous({ when: start, stop: queryParamsCheck });

const redirectBack = sample({
  source: merge([queryParamsCheck, sessionGetFx.done]),
  filter: $redirectParams.map((params) => Boolean(params)),
});

sample({
  source: queryParamsCheck,
  filter: $redirectParams.map((params) => !params),
  target: historyPush.prepend(path.home),
});

sample({
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

export const $formPending = pending({ effects: [sessionCreateFx, sessionGetFx] });
export const $formDisabled = $formPending;

const formDomain = createDomain();
export const $email = formDomain.createStore<string>('');
export const $password = formDomain.createStore<string>('');
export const $error = formDomain.createStore<Failure | null>(null);

const $form = combine({ email: $email, password: $password });
const $isFormEmpty = $form.map(
  ({ email, password }) => email.trim().length === 0 || password.trim().length === 0,
);

formDomain.onCreateStore(($store) => $store.reset(pageReady));

$email.on(emailChange, (_, email) => email);
$password.on(passwordChange, (_, password) => password);

$error.reset(pageReady, sessionCreateFx);

const formChangedAfterEmpty = guard({
  clock: $form.updates,
  filter: $isFormEmpty,
});

$error.on(formChangedAfterEmpty, () => null);

const $allowToSubmitForm = combine(
  $isFormEmpty,
  $formDisabled,
  (empty, disabled) => !empty && !disabled,
);

guard({
  clock: formSubmit,
  source: $form.map((body) => ({ body })),
  filter: $allowToSubmitForm,
  target: sessionCreateFx,
});

forward({
  from: sessionCreateFx.done,
  to: sessionGetFx,
});

$error.on(sessionCreateFx.failData, (_, failed) => {
  // TODO: fix generator, because contract is broken
  if ((failed as any).status === 400) {
    return (failed as any).body.error;
  }
  return 'unexpected';
});

const formEmptySubmitted = sample({
  source: formSubmit,
  filter: $isFormEmpty,
});

$error.on(formEmptySubmitted, () => 'empty_form');

function queryParamsToLoginParams(queryParams: Record<string, string>): RedirectParams | null {
  if (!queryParams.redirectBackUrl) {
    return null;
  }
  return {
    url: queryParams.redirectBackUrl,
  };
}
