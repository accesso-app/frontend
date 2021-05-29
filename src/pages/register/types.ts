export type RegisterError =
  | 'email_already_registered'
  | 'invalid_form'
  | 'invalid_payload'
  | 'unexpected'
  | null;
