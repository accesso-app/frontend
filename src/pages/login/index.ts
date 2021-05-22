import { ChangeEvent } from 'react';
import { contract } from 'lib/contract';
import * as model from './model';
import * as page from './page';

export { LoginPage } from './page';

contract({
  page,
  model: {
    ...model,
    formSubmitted: model.formSubmit.prepend(noop),
    emailChanged: model.emailChange.prepend(getValue),
    passwordChanged: model.passwordChange.prepend(getValue),
  },
});

function getValue(event: ChangeEvent<HTMLInputElement>): string {
  return event.currentTarget.value;
}

function noop(_: any): void {}
