export type ConfirmationError =
  | 'password_is_too_short'
  | 'password_is_too_weak'
  | 'invalid_code'
  | 'repeat_password_wrong'
  | 'invalid_email'
  | 'invalid_password'
  | 'unexpected'
  | null;
