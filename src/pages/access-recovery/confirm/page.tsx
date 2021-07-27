import React, { ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import { Button, Input, Title } from 'woly';
import { createEvent, createStore } from 'effector-root';
import { reflect } from 'effector-reflect';

import Logo from 'logo.svg';
import { CenterCardTemplate } from '@auth/ui';
import { createStart, withStart } from 'lib/page-routing';

import { ofErrors } from 'lib/errors';
import { ConfirmationError } from './types';

export const pageStart = createStart();
export const passwordChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const rePasswordChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const formSubmitted = createEvent<FormEvent<HTMLFormElement>>();

export const $password = createStore('');
export const $rePassword = createStore('');
export const $isPending = createStore(false);
export const $error = createStore<ConfirmationError>(null);

const $errorText = $error.map(
  ofErrors<ConfirmationError>({
    invalid_code:
      'The access recovery link is invalid. Please, start access recovery process again.',
    invalid_email: 'Email is not valid',
    invalid_password: 'Password is not valid',
    password_is_too_short: 'The password should be at least 8 letters long',
    password_is_too_weak: 'The password looks very weak, add some symbols',
    repeat_password_wrong: 'Confirm password does not match',
    unexpected: 'Oops, something went wrong',
  }),
);

export const AccessRecoveryConfirmPage = withStart(pageStart, () => (
  <CenterCardTemplate>
    <Container>
      <Logotype />
      <Title level={2}>Access Recovery</Title>
      <Form>
        <NewPassword />
        <RepeatPassword />
        <Failure />
        <Group>
          <Submit />
        </Group>
      </Form>
    </Container>
  </CenterCardTemplate>
));

const Form = reflect({
  view: styled.form``,
  bind: {
    onSubmit: formSubmitted,
    disabled: $isPending,
  },
});
formSubmitted.watch((event) => event.preventDefault());

const NewPassword = reflect({
  view: Input,
  bind: {
    value: $password,
    onChange: passwordChanged,
    disabled: $isPending,
    placeholder: 'New password',
    type: 'password',
  },
});

const RepeatPassword = reflect({
  view: Input,
  bind: {
    value: $rePassword,
    onChange: rePasswordChanged,
    disabled: $isPending,
    placeholder: 'Repeat password',
    type: 'password',
  },
});

const Failure = reflect({
  view: ({ error }: { error: string | null }) =>
    error ? <Text>{error}</Text> : null,
  bind: {
    error: $errorText,
  },
});

const Submit = reflect({
  view: Button,
  bind: {
    type: 'submit',
    disabled: $isPending,
    text: 'Save password',
  },
});

const Logotype = styled(Logo)`
  margin-bottom: 3rem;
  display: flex;
  flex-shrink: 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: content-box;
  height: 100%;
`;

const Group = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 3rem;

  & *:not(:first-child) {
    margin-left: 2rem;
  }
`;

const Text = styled.div`
  font-size: 1.8rem;
`;
