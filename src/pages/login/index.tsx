import { ChangeEvent } from 'react';
import { bus } from 'lib/bus';
import { StartParams } from 'lib/page-routing';

import * as model from './model';
import * as page from './page';

export { LoginPage } from './page';

bus({
  events: [
    [page.pageLoaded, model.start, noop],
    [page.formSubmitted, model.formSubmit],
    [page.emailChanged, model.emailChange, getValue],
    [page.passwordChanged, model.passwordChange, getValue],
  ],
  stores: [
    [model.$email, page.$email],
    [model.$password, page.$password],
    [model.$failure, page.$failure],
    [model.$formDisabled, page.$formDisabled],
    [model.$formPending, page.$formPending],
  ],
});

function getValue(event: ChangeEvent<HTMLInputElement>): string {
  return event.currentTarget.value;
}

function noop(_value: StartParams): void {}
