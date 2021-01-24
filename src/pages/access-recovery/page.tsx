import React, { ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import { Button, Title, Input } from 'woly';
import { createStore, createEvent } from 'effector-root';
import { reflect } from 'effector-reflect/ssr';

import Logo from 'logo.svg';
import { CenterCardTemplate } from '@auth/ui';
import { createStart, withStart } from 'lib/page-routing';

import { AccessRecoveryError } from './types';

export const pageStarted = createStart();
export const emailChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const formSubmitted = createEvent<FormEvent<HTMLFormElement>>();

export const $isPending = createStore(false);
export const $email = createStore('');
export const $error = createStore<AccessRecoveryError>(null);

const $errorText = $error.map((error) => {
  switch (true) {
    case error === 'invalid_email':
      return 'Email is invalid';
    case error === null:
      return null;
    default:
      return 'Oops, something went wrong';
  }
});

export const AccessRecoveryPage = withStart(pageStarted, () => (
  <CenterCardTemplate>
    <Container>
      <Logotype />
      <Form>
        <Title level={2}>Access Recovery</Title>
        <Email placeholder="email" />
        <Failure />

        <Group>
          <Submit text="Send email" variant="primary" />
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

const Email = reflect({
  view: Input,
  bind: {
    value: $email,
    onChange: emailChanged,
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
  },
});

const Logotype = styled(Logo)`
  margin-bottom: 3rem;
  display: flex;
  flex-shrink: 0;
`;

const Group = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 3rem;

  & *:not(:first-child) {
    margin-left: 2rem;
  }

  &[data-direction='column'] {
    flex-direction: column;

    & *:not(:first-child) {
      margin-left: initial;
      margin-top: 1rem;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: content-box;
  height: 100%;
`;

const Text = styled.div`
  font-size: 1.8rem;
`;
