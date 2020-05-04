import * as typed from 'typed-contracts';
import { createResource } from './request';

export type SessionUser = typed.Get<typeof TSessionUser>;
const TSessionUser = typed.object({
  firstName: typed.string,
  lastName: typed.string,
});

const TSessionGetSuccess = typed.object({
  user: TSessionUser,
});

export const sessionGet = createResource({
  name: 'sessionGet',
  contractDone: TSessionGetSuccess,
  contractFail: typed.nul,
  mapParams: () => ({ path: '/session/get', method: 'POST' }),
});

const TSessionCreateSucceeded = typed.object({
  firstName: typed.string,
  lastName: typed.string,
});

const TSessionCreateFailed = typed.object({
  error: typed.union('invalid_credentials', 'invalid_form', 'invalid_payload'),
});

interface SessionCreate {
  email: string;
  password: string;
}

export const sessionCreate = createResource({
  name: 'sessionCreate',
  contractDone: TSessionCreateSucceeded,
  contractFail: TSessionCreateFailed,
  mapParams: (form: SessionCreate) => ({
    path: '/session/create',
    method: 'POST',
    body: form,
  }),
});
