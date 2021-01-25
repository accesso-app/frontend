import { ChangeEvent, FormEvent } from 'react';
import { bus } from 'lib/bus';
import { StartParams } from 'lib/page-routing';

import * as model from './model';
import * as page from './page';

export { LoginPage } from './page';

bus({
  events: [
    [page.pageStarted, model.pageStarted],
    [page.formSubmitted, model.formSubmit, noopSubmit],
    [page.emailChanged, model.emailChange, getValue],
    [page.passwordChanged, model.passwordChange, getValue],
  ],
  stores: [
    [model.$email, page.$email],
    [model.$password, page.$password],
    [model.$error, page.$error],
    [model.$formDisabled, page.$formDisabled],
    [model.$formPending, page.$formPending],
  ],
});

// contract({
//   model,
//   stores: { // or stores: page,
//     $email: page.$email,
//   },
//   events: {
//     start: page.pageLoaded.map(() => {}),
//     formSubmit: page.formSubmitted.map(() => {}),
//     emailChange: page.emailChanged.map(getValue),
//   },
// })

function getValue(event: ChangeEvent<HTMLInputElement>): string {
  return event.currentTarget.value;
}

function noop(_value: StartParams): void {}
function noopSubmit(_value: FormEvent<HTMLFormElement>): void {}
