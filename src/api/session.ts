// @ts-nocheck
import { attach, Event } from 'lib/effector';
import { requestFx } from './request';

interface SessionUser {
  firstName: string;
  lastName: string;
}

interface SessionGetSuccess {
  user: SessionUser;
}

export const sessionGet = attach({
  effect: requestFx,
  mapParams: () => ({
    path: 'session/get',
    method: 'POST',
  }),
});

export const sessionGetDone: Event<SessionGetSuccess> = sessionGet.done.map(
  ({ params, result }) => ({
    params,
    result: result.body,
  }),
);
