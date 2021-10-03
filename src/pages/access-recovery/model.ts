import {
  attach,
  createEvent,
  createStore,
  guard,
  restore,
  sample,
} from 'effector';

import * as api from 'api';
import { validateEmail } from 'lib/email';
import { createStart } from 'lib/page-routing';
import { splitMap } from 'patronum/split-map';
import { AccessRecoveryError } from './types';

const sendRecoveryEmailFx = attach({ effect: api.accessRecoverySendEmail });
const { sentFailed, __: unexpectedFailure } = splitMap({
  source: sendRecoveryEmailFx.failData,
  cases: {
    sentFailed: (answer) =>
      answer.status === 'bad_request' ? answer.error : undefined,
  },
});

export const pageStarted = createStart();
export const emailChanged = createEvent<string>();
export const formSubmitted = createEvent();

export const $email = restore<string>(emailChanged, '');
export const $failure = createStore<AccessRecoveryError>(null);
export const $isPending = sendRecoveryEmailFx.pending;

$email.on(emailChanged, (_, email) => email);

$failure
  .reset(formSubmitted, pageStarted)
  .on(sentFailed, (_, { error }) => error)
  .on(unexpectedFailure, () => 'unexpected')
  .on(emailChanged, (_, email) => {
    const isValid = validateEmail(email);
    if (isValid) return;
    return 'invalid_email';
  });

sample({
  source: { email: $email },
  clock: guard(formSubmitted, { filter: $email.map((is) => Boolean(is)) }),
  fn: (body) => ({ body }),
  target: sendRecoveryEmailFx,
});
