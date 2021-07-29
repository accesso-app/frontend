import {
  combine,
  createStore,
  createEffect,
  createEvent,
  restore,
  guard,
} from 'effector-root';
import { sleep } from 'lib/sleep';
import { validateEmail } from 'lib/email';
import { EmailErrorType, RequestFailure } from './types';

const requestFx = createEffect(
  async (req: { email: string; password: string }) => {
    await sleep(2000);
    const isSuccess = Math.random() > 0.5;
    if (isSuccess) return req;

    throw {
      type: RequestFailure.required,
    };
  },
);

const changeEmail = createEvent<string>();
const $newEmail = restore(changeEmail, '');
const changePassword = createEvent<string>();
const $password = restore(changePassword, '');

const $emailError = $newEmail.map((email) => {
  if (!email) return EmailErrorType.required;
  if (!validateEmail(email)) return EmailErrorType.invalid;
  return null;
});
const $isEmailValid = $emailError.map((error) => !error);
const $isPasswordValid = $password.map(Boolean);

const $isFormValid = combine(
  $isEmailValid,
  $isPasswordValid,
  (isEmail, isPw) => isEmail && isPw,
);

const $isFormPending = requestFx.pending;

const $isSubmitDisabled = combine(
  $isFormValid,
  $isFormPending,
  (isValid, isPending) => !isValid || isPending,
);

const $isFormDisabled = $isFormPending.map((is) => !is);

const $errorType = createStore<RequestFailure | null>(null);

const submitForm = createEvent();

requestFx.finally.watch((res) => {
  if (res.status === 'fail') console.log(res.error);
  if (res.status === 'done') console.log(res.result);
});

guard({
  clock: submitForm,
  filter: $isSubmitDisabled.map((is) => !is),
  source: { email: $newEmail, password: $password },
  target: requestFx,
});

export {
  submitForm,
  $newEmail,
  changeEmail,
  $password,
  changePassword,
  $emailError,
  $isFormDisabled,
  $isSubmitDisabled,
  $isFormPending,
  $errorType,
};
