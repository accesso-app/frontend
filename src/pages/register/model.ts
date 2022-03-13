import { combine, createEvent, createStore, guard } from 'effector';
import { ChangeEvent, FormEvent } from 'react';

import { path } from 'pages/paths';

import { historyPush } from 'features/navigation';
import { checkAnonymous } from 'features/session';

import { registerRequest } from 'shared/api';
import { createStart } from 'shared/lib/page-routing';

export type RegisterFailure = 'email_already_registered' | 'invalid_form' | 'invalid_payload';

export const start = createStart();

export const formSubmitted = createEvent<FormEvent<HTMLFormElement>>();
export const emailChanged = createEvent<ChangeEvent<HTMLInputElement>>();
const changedEmail = emailChanged.map((event) => event.currentTarget.value);
export const haveInviteClicked = createEvent();
export const continueWithInviteClicked = createEvent();
export const alreadyRegisteredInviteClicked = createEvent();
export const inviteCodeChanged = createEvent<string>();

export const $mode = createStore<'request' | 'invite'>('request');

export const $emailSubmitted = createStore(false);
export const $failure = createStore<RegisterFailure | null>(null);

export const $formPending = registerRequest.pending;

export const $email = createStore<string>('');
export const $isEmailValid = $email.map((email) => email.includes('@') && email.length > 5);

export const $isSubmitEnabled = combine(
  $formPending,
  $isEmailValid,
  (pending, valid) => !pending && valid,
);

export const $inviteCode = createStore('');
const inviteRegex = /^\w+-\w+-\w+-\w+$/gi;
export const $isInviteValid = $inviteCode.map((code) => code.match(inviteRegex) !== null);

const $form = combine({ email: $email });

const pageReady = checkAnonymous({ when: start });

$emailSubmitted.on(pageReady, () => false);
$failure.on(pageReady, () => null);

$email.on(changedEmail, (_, email) => email);

guard({
  clock: formSubmitted,
  source: $form,
  filter: $isSubmitEnabled,
  target: registerRequest.prepend((body: { email: string }) => ({ body })),
});

$failure.on(registerRequest, () => null);
$emailSubmitted.on(registerRequest.done, () => true);

$emailSubmitted.on(registerRequest.fail, () => false);
$failure.on(registerRequest.failData, (_, failure) => {
  if (failure.status !== 'bad_request') {
    return null;
  }

  return failure.error.error;
});

$mode.on(haveInviteClicked, () => 'invite').reset(alreadyRegisteredInviteClicked, start);
$inviteCode.on(inviteCodeChanged, (_, invite) => invite).reset($mode, start);

guard({
  source: $inviteCode,
  filter: $isInviteValid,
  clock: continueWithInviteClicked,
  target: historyPush.prepend((code: string) => path.registerConfirm(code)),
});
