export type AccessRecoveryConfirmError = 'invalid_email' | 'invalid_password';

export function mapErrors(error: AccessRecoveryConfirmError) {
  switch (error) {
    case 'invalid_email':
      return 'Email is invalid';
    case 'invalid_password':
      return 'Password is invalid';
    default:
      return 'Oops, something went wrong';
  }
}
