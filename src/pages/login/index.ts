import { ChangeEvent } from 'react';

import { contract } from 'shared/lib/contract';
import { withStart } from 'shared/lib/page-routing';

import * as model from './model';
import * as page from './page';

contract({
  page,
  model: {
    ...model,
    formSubmitted: model.formSubmit.prepend(noop),
    emailChanged: model.emailChange.prepend(getValue),
    passwordChanged: model.passwordChange.prepend(getValue),
  },
});

export const LoginPage = withStart(model.start, page.LoginPage);

function getValue(event: ChangeEvent<HTMLInputElement>): string {
  return event.currentTarget.value;
}

function noop(): void {}
