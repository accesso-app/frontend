import { attach, Event, Effect } from 'effector-root';
import * as typed from 'typed-contracts';
import { assertContract, ContractType } from 'lib/typed';
import { requestFx, Answer } from './request';

export type SessionUser = ContractType<typeof TSessionUser>;
const TSessionUser = typed.object({
  firstName: typed.string,
  lastName: typed.string,
});

type SessionGetSuccess = ContractType<typeof TSessionGetSuccess>;
const TSessionGetSuccess = typed.object({
  user: TSessionUser('user'),
});

export const sessionGet: Effect<void, Answer, Answer> = attach({
  effect: requestFx,
  mapParams: () => ({
    path: '/session/get',
    method: 'POST',
  }),
});

export const sessionGetDone: Event<SessionGetSuccess> = sessionGet.done.map(
  ({ result }) => assertContract(TSessionGetSuccess, result.body),
);

type SessionCreateSucceeded = ContractType<typeof TSessionCreateSucceeded>;
const TSessionCreateSucceeded = typed.object({
  firstName: typed.string,
  lastName: typed.string,
});

const TSessionCreateFailed = typed.object({
  // TODO: fix any as error
  error: typed.union('invalid_credentials', 'invalid_form', 'invalid_payload'),
});
// type SessionCreateFailed = ContractType<typeof TSessionCreateFailed>;
type SessionCreateFailed = {
  error: 'invalid_credentials' | 'invalid_form' | 'invalid_payload';
};

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
  ({ result }) => assertContract(TSessionCreateSucceeded, result.body, 'body'),
);

export const sessionCreateFail: Event<
  SessionCreateFailed | Error
> = sessionCreate.fail.map(({ error }) => {
  if (error.status === 400) {
    return assertContract(TSessionCreateFailed, error.body, 'body');
  }
  return new Error(String(error.body));
});
