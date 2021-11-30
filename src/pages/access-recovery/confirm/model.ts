import { attach, createEvent, createStore, guard, restore, sample } from 'effector';
import { splitMap } from 'patronum/split-map';

import { checkAnonymous } from 'features/session';

import * as api from 'shared/api';

import { createStart } from 'lib/page-routing';
import { validatePassword } from 'lib/password';

import { ConfirmationError } from './types';

const changePasswordFx = attach({ effect: api.accessRecoverySetPassword });
const { sentFailed, __: unexpectedFailure } = splitMap({
  source: changePasswordFx.failData,
  cases: {
    sentFailed: (answer) => (answer.status === 'bad_request' ? answer.error : undefined),
  },
});

export const pageStart = createStart();
export const passwordChanged = createEvent<string>();
export const rePasswordChanged = createEvent<string>();
export const formSubmitted = createEvent();

export const $password = restore<string>(passwordChanged, '');
export const $rePassword = restore<string>(rePasswordChanged, '');
export const $error = createStore<ConfirmationError>(null);
export const $isPending = changePasswordFx.pending;

const pageReady = checkAnonymous({ when: pageStart });
const codeReceived = pageReady.filterMap(({ params }) => params.code);
const $code = restore<string>(codeReceived, '');
const $isPasswordValid = $password.map(validatePassword);

$error
  .reset(pageReady)
  .on(sentFailed, (_, { error }) => error)
  .on(unexpectedFailure, () => 'unexpected');

sample({
  source: [$password, $rePassword],
  clock: formSubmitted,
  fn: ([password, rePassword]) => {
    const isEqual = password === rePassword;
    const hasEightLetters = password.length >= 8;

    switch (true) {
      case !hasEightLetters:
        return 'password_is_too_short';
      case !isEqual:
        return 'repeat_password_wrong';
      default:
        return null;
    }
  },
  target: $error,
});

const formValid = guard({
  source: { password: $password, code: $code },
  clock: formSubmitted,
  filter: $isPasswordValid,
});

sample({
  clock: formValid,
  fn: (body) => ({ body }),
  target: changePasswordFx,
});
