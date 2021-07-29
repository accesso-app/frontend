import React, { ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import { reflect } from 'effector-reflect';
import { Button, Form, Input, Title } from 'woly';
import { createEvent, createStore, StoreValue } from 'effector-root';
import { EmailErrorType, RequestFailure } from './types';

export const formSubmitted = createEvent<FormEvent>();

export const $userNewEmail = createStore('');
export const newEmailChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const $password = createStore('');
export const passwordChanged = createEvent<ChangeEvent<HTMLInputElement>>();

export const $emailError = createStore<EmailErrorType | null>(null);
const $emailErrorMessage = $emailError.map((error) => {
  if (error === EmailErrorType.required) return 'Email is required';
  if (error === EmailErrorType.invalid) return 'Email is invalid';
  return null;
});
const $passwordErrorMessage = $password.map((pw) => {
  if (!pw) return 'Password is required';
  return null;
});

export const $isFormDisabled = createStore(false);
export const $isSubmitDisabled = createStore(false);

export const $isFormPending = createStore(false);
const $submitText = $isFormPending.map((is) => (is ? 'Sending...' : 'Change'));

export const $errorType = createStore<RequestFailure | null>(null);
const $errorText = $errorType.map((errorType) => {
  if (!errorType) return null;
  return 'AAAA';
});

export const EmailsProfilePage = () => {
  return (
    <FormWrapper>
      <EmailForm>
        <Title level={1}>Change email form</Title>
        <Title level={2}>Email</Title>
        <Email placeholder="your new email" />
        <EmailError />
        <Title level={2}>Password</Title>
        <Password placeholder="password" type="password" />
        <PasswordError />
        <ErrorBlock />
        <Submit type="submit" />
      </EmailForm>
    </FormWrapper>
  );
};

const Email = reflect({
  view: Input,
  bind: {
    value: $userNewEmail,
    onChange: newEmailChanged,
    disabled: $isFormDisabled,
  },
});
const Password = reflect({
  view: Input,
  bind: {
    value: $password,
    onChange: passwordChanged,
    disabled: $isFormDisabled,
  },
});
const EmailError = reflect({
  view: ({ error }: { error: StoreValue<typeof $emailErrorMessage> }) => {
    if (error) return <ErrorTitle>{error}</ErrorTitle>;
    return null;
  },
  bind: {
    error: $emailErrorMessage,
  },
});
const PasswordError = reflect({
  view: ({ error }: { error: StoreValue<typeof $passwordErrorMessage> }) => {
    if (error) return <ErrorTitle>{error}</ErrorTitle>;
    return null;
  },
  bind: {
    error: $passwordErrorMessage,
  },
});

const ErrorBlock = reflect({
  view: ({ failure }: { failure: string | null }) => {
    if (failure) {
      return <Fail>{failure}</Fail>;
    }
    return null;
  },
  bind: {
    failure: $errorText,
  },
});

const Submit = reflect({
  view: Button,
  bind: {
    disable: $isSubmitDisabled,
    text: $submitText,
  },
});

const EmailForm = reflect({
  view: Form,
  bind: {
    onSubmit: formSubmitted,
  },
});

const Fail = styled.div`
  font-size: 1.3rem;
  margin-bottom: 1rem;
`;
const ErrorTitle = styled.span`
  color: red;
  display: block;
`;
const FormWrapper = styled.div`
  padding: 3rem;
`;
