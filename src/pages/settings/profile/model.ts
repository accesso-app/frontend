import { ChangeEvent, FormEvent } from 'react';
import { createStart } from 'lib/page-routing';
import {
  createStore,
  createEvent,
  createEffect,
  combine,
  guard,
} from 'effector-root';
import { $session } from 'features/session';
import { sleep } from 'lib/sleep';
import { RequestFailure, FieldError } from './types';

export const pageStarted = createStart();

const requestFx = createEffect(
  async (req: { firstName: string; lastName: string }) => {
    await sleep(2000);
    const isSuccess = Math.random() > 0.5;
    if (isSuccess) {
      return req;
    }
    const errorTypes = [
      RequestFailure.one,
      RequestFailure.two,
      RequestFailure.unexpected,
    ];
    const errorIndex = Math.floor(Math.random() * errorTypes.length);
    throw {
      type: errorTypes[errorIndex],
    };
  },
);

const $userFirstName = createStore('');
const $userLastName = createStore('');
const changeFirstName = createEvent<ChangeEvent<HTMLInputElement>>();
const changeLastName = createEvent<ChangeEvent<HTMLInputElement>>();

$userFirstName
  .on(changeFirstName, (_, e) => e.target.value)
  .on($session, (_, session) => session?.firstName);
$userLastName
  .on(changeLastName, (_, e) => e.target.value)
  .on($session, (_, session) => session?.lastName);

function validateField(field: string) {
  if (!field) return FieldError.required;
  if (field.length > 32) return FieldError.maxLength;
  return null;
}
const $firstNameError = $userFirstName.map(validateField);
const $lastNameError = $userLastName.map(validateField);

const $isFirstNameValid = $firstNameError.map((error) => !error);
const $isLastNameValid = $lastNameError.map((error) => !error);

const $isFormValid = combine(
  $isFirstNameValid,
  $isLastNameValid,
  (isFirst, isLast) => isFirst && isLast,
);
const $isFormPending = requestFx.pending;

const $isSubmitDisabled = combine(
  $isFormValid,
  $isFormPending,
  (isValid, isPending) => !isValid || isPending,
);
const $isFormDisabled = $isFormPending.map((is) => is);

const $errorType = createStore<RequestFailure | null>(null);

const submitForm = createEvent<FormEvent>();

guard({
  clock: submitForm,
  filter: $isSubmitDisabled.map((is) => !is),
  source: { firstName: $userFirstName, lastName: $userLastName },
  target: requestFx,
});

// todo: replace with mocks
requestFx.finally.watch((res) => {
  if (res.status === 'fail') {
    console.log(res.error);
  }
  if (res.status === 'done') {
    console.log(res.result);
  }
});

export {
  $userFirstName,
  $userLastName,
  changeFirstName,
  changeLastName,
  submitForm,
  $firstNameError,
  $lastNameError,
  $isFormDisabled,
  $isSubmitDisabled,
  $isFormPending,
  $errorType,
};
