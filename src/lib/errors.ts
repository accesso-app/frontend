export type ValidErrors<T> = Exclude<T, undefined | null>;

export function selectError<
  Names extends string,
  Errors extends Record<Names, string> & { unexpected: string }
>(errors: Errors): (error: Names | null) => string | null {
  return (error) => {
    if (error && errors[error]) {
      return errors[error];
    }
    if (!error) return null;
    return errors.unexpected;
  };
}

export function ofErrors<E extends string | null | undefined>(
  errors: Record<ValidErrors<E>, string> & { unexpected: string },
) {
  return selectError(errors);
}
