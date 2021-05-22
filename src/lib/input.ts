import { ChangeEvent } from 'react';

export function getValue(event: ChangeEvent<HTMLInputElement>) {
  return event.currentTarget.value;
}
