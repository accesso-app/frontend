import React, { ChangeEvent, FormEvent } from 'react';
import { Button, Form, Input, Title } from 'woly';
import { combine, createEvent, createStore, StoreValue } from 'effector-root';
import { reflect } from 'effector-reflect/ssr';
import styled from 'styled-components';
import { FieldError, RequestFailure } from './types';

export const $userFirstName = createStore('');
export const $userLastName = createStore('');
export const firstNameChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const lastNameChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const formSubmitted = createEvent<FormEvent>();

export const $firstNameError = createStore<FieldError | null>(null);
export const $lastNameError = createStore<FieldError | null>(null);
const $firstNameErrorMessage = combine(
  $firstNameError,
  $userFirstName,
  (error, firstName) => {
    if (error === FieldError.required) return 'Field is required';
    if (error === FieldError.maxLength)
      return `Field is too long (${firstName.length}/32)`;
    return null;
  },
);
const $lastNameErrorMessage = combine(
  $lastNameError,
  $userLastName,
  (error, lastName) => {
    if (error === FieldError.required) return 'Field is required';
    if (error === FieldError.maxLength)
      return `Field is too long (${lastName.length}/32)`;
    return null;
  },
);

export const $isFormDisabled = createStore(false);
export const $isSubmitDisabled = createStore(false);

export const $isFormPending = createStore(false);
const $submitText = $isFormPending.map((isPending) =>
  isPending ? 'Sending...' : 'Change',
);

export const $errorType = createStore<RequestFailure | null>(null);
const $errorText = $errorType.map((errorType) => {
  if (!errorType) return null;
  return 'AAAA';
});

export const SettingsProfilePage = () => {
  return (
    <FormWrapper>
      <UserForm>
        <Title level={2}>First name</Title>
        <FirstName placeholder="First name" />
        <FirstNameError />
        <Title level={2}>Last name</Title>
        <LastName placeholder="Last name" />
        <LastNameError />
        <ErrorBlock />
        <Submit type="submit" />
      </UserForm>
    </FormWrapper>
  );
};

const FirstName = reflect({
  view: Input,
  bind: {
    value: $userFirstName,
    onChange: firstNameChanged,
    disabled: $isFormDisabled,
  },
});
const LastName = reflect({
  view: Input,
  bind: {
    value: $userLastName,
    onChange: lastNameChanged,
    disabled: $isFormDisabled,
  },
});
const FirstNameError = reflect({
  bind: {
    error: $firstNameErrorMessage,
  },
  view: ({ error }: { error: StoreValue<typeof $firstNameErrorMessage> }) => {
    if (error) return <ErrorTitle>{error}</ErrorTitle>;
    return null;
  },
});
const LastNameError = reflect({
  bind: {
    error: $lastNameErrorMessage,
  },
  view: ({ error }: { error: StoreValue<typeof $lastNameErrorMessage> }) => {
    if (error) return <ErrorTitle>{error}</ErrorTitle>;
    return null;
  },
});
const ErrorBlock = reflect({
  bind: {
    failure: $errorText,
  },
  view: ({ failure }: { failure: string | null }) => {
    if (failure) {
      return <Fail>{failure}</Fail>;
    }
    return null;
  },
});
const Submit = reflect({
  view: Button,
  bind: {
    disabled: $isSubmitDisabled,
    text: $submitText,
  },
});
const UserForm = reflect({
  view: Form,
  bind: {
    onSubmit: formSubmitted,
  },
});

const FormWrapper = styled.div`
  padding: 3rem;
`;
const Fail = styled.div`
  font-size: 1.3rem;
  margin-bottom: 1rem;
`;
const ErrorTitle = styled.span`
  color: red;
`;
