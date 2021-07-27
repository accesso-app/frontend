import React, { ChangeEvent, FormEvent } from 'react';
import { Button, Input, Form, Title } from 'woly';
import { createStore, createEvent, StoreValue } from 'effector-root';
import { reflect } from 'effector-reflect/ssr';
import styled from 'styled-components';
import { Failure } from './types';

export const $userFirstName = createStore('');
export const $userLastName = createStore('');
export const firstNameChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const lastNameChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const formSubmitted = createEvent<FormEvent>();

export const $firstNameError = createStore<string | null>(null);
export const $lastNameError = createStore<string | null>(null);

export const $isFormDisabled = createStore(false);
export const $isSubmitDisabled = createStore(false);

export const $isFormPending = createStore(false);
const $submitText = $isFormPending.map((isPending) =>
  isPending ? 'Sending...' : 'Change',
);

export const $errorType = createStore<Failure | null>(null);
const $errorText = $errorType.map((errorType) => {
  if (!errorType) return null;
  return 'AAAA';
});

export const SettingsProfilePage = () => {
  return (
    <FormWrapper>
      <UserForm>
        <Title level={2}>First name</Title>
        <FirstName />
        <FirstNameError />
        <Title level={2}>Last name</Title>
        <LastName />
        <LastNameError />
        <ErrorBlock />
        <Submit />
      </UserForm>
    </FormWrapper>
  );
};

const FirstName = reflect({
  view: Input,
  bind: {
    value: $userFirstName,
    onChange: firstNameChanged,
    placeholder: 'First name',
    disabled: $isFormDisabled,
  },
});
const LastName = reflect({
  view: Input,
  bind: {
    value: $userLastName,
    onChange: lastNameChanged,
    placeholder: 'Last name',
    disabled: $isFormDisabled,
  },
});
const FirstNameError = reflect({
  bind: {
    error: $firstNameError,
  },
  view: ({ error }: { error: StoreValue<typeof $firstNameError> }) => {
    if (error) return <ErrorTitle>{error}</ErrorTitle>;
    return null;
  },
});
const LastNameError = reflect({
  bind: {
    error: $lastNameError,
  },
  view: ({ error }: { error: StoreValue<typeof $lastNameError> }) => {
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
    type: 'submit',
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
