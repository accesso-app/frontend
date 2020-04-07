// @ts-nocheck
import { attach, Event, Effect } from 'lib/effector';
import { requestFx, Answer } from './request';

export interface SessionUser {
  firstName: string;
  lastName: string;
}

interface SessionGetSuccess {
  user: SessionUser;
}

export const sessionGet = attach({
  effect: requestFx,
  mapParams: () => ({
    path: '/session/get',
    method: 'POST',
  }),
});

export const sessionGetDone: Event<SessionGetSuccess> = sessionGet.done.map(
  ({ params, result }) => ({
    params,
    result: result.body,
  }),
);

interface SessionCreateSucceeded {
  firstName: string;
  lastName: string;
}

interface SessionCreateFailed {
  error: 'invalid_credentials' | 'invalid_form' | 'invalid_payload';
}

interface SessionCreate {
  email: string;
  password: string;
}

export const sessionCreate: Effect<SessionCreate, Answer, Answer> = attach({
  effect: requestFx,
  mapParams: ({ email, password }) => ({
    path: '/session/create',
    method: 'POST',
    body: { email, password },
  }),
});

export const sessionCreateDone: Event<SessionCreateSucceeded> = sessionCreate.done.map(
  ({ result }) => result.body,
);

export const sessionCreateFail: Event<
  SessionCreateFailed | Error
> = sessionCreate.fail.map(({ error }) => {
  if (error.status === 400) {
    return error.body;
  }
  return new Error(String(error.body));
});
