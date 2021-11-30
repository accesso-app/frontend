export function validatePassword(password: string) {
  return password.trim().length >= 8;
}
