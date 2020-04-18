import * as typed from 'typed-contracts';
import { createResource } from './request';

interface RegisterRequest {
  email: string;
}

const TRegisterRequestSuccess = typed.object({
  expiresAt: typed.number,
});

const TRegisterRequestFailure = typed.object({
  error: typed.union(
    'email_already_registered',
    'invalid_form',
    'invalid_payload',
  ),
});

export const registerRequest = createResource({
  name: 'registerRequest',
  contractDone: TRegisterRequestSuccess,
  contractFail: TRegisterRequestFailure,
  mapParams: (form: RegisterRequest) => ({
    path: '/register/request',
    method: 'POST',
    body: form,
  }),
});

interface RegisterConfirmation {
  confirmationCode: string;
  firstName: string;
  lastName: string;
  password: string;
}

const empty = typed.literal('');

const TRegisterConfirmationFailure = typed.object({
  error: typed.union(
    'code_invalid_or_expired',
    'email_already_activated',
    'invalid_form',
    'invalid_payload',
  ),
});

export const registerConfirmation = createResource({
  name: 'registerConfirmation',
  contractDone: empty,
  contractFail: TRegisterConfirmationFailure,
  mapParams: (form: RegisterConfirmation) => ({
    path: '/register/confirmation',
    method: 'POST',
    body: form,
  }),
});
