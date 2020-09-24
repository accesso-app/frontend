export function validatePassword(password: string) {
  const hasEightLetters = password.trim().length >= 8;

  return hasEightLetters;
}
