import { ChangeEvent } from 'react';

export function getValue(event: ChangeEvent<HTMLInputElement>) {
  const value = event.currentTarget.value;

  return value;
}
