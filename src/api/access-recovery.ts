import * as typed from 'typed-contracts';
import { createResource } from './request';

interface SendRecoveryEmailRequest {
  email: string;
}

interface ChangePasswordRequest {
  code: string;
  password: string;
}

const TSendRecoveryEmailSuccess = typed.nul;

const TSendRecoveryEmailFailure = typed.object({
  error: typed.union('invalid_email'),
});

const TChangePasswordSuccess = typed.nul;

const TChangePasswordFailure = typed.object({
  error: typed.union('invalid_email', 'invalid_password'),
});

export const sendRecoveryEmail = createResource({
  name: 'sendRecoveryEmailRequest',
  contractDone: TSendRecoveryEmailSuccess,
  contractFail: TSendRecoveryEmailFailure,
  mapParams: (form: SendRecoveryEmailRequest) => ({
    path: '/access-recovery/send-email',
    method: 'POST',
    body: form,
  }),
});

export const changePassword = createResource({
  name: 'changePasswordRequest',
  contractDone: TChangePasswordSuccess,
  contractFail: TChangePasswordFailure,
  mapParams: (form: ChangePasswordRequest) => ({
    path: '/access-recovery/set-password',
    method: 'POST',
    body: form,
  }),
});
