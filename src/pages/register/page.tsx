import React, { ChangeEvent, FormEvent, ReactNode } from 'react';
import styled from 'styled-components';
import { Button, Title, Input } from 'woly';
import { Link } from 'react-router-dom';
import { createEvent, createStore } from 'effector-root';
import { useStore, useEvent } from 'effector-react/ssr';
import { reflect } from 'effector-reflect/ssr';
import { every } from 'patronum/every';

import Logo from 'logo.svg';
import { path } from 'pages/paths';
import { createStart, withStart } from 'lib/page-routing';
import { Branch } from 'lib/branch';
import { CenterCardTemplate } from '@auth/ui';

import { RegisterError } from './types';

export const pageStarted = createStart();
export const formSubmitted = createEvent<FormEvent<HTMLFormElement>>();
export const emailChanged = createEvent<ChangeEvent<HTMLInputElement>>();

export const $isSubmitDisabled = createStore(true);
export const $isFormPending = createStore(false);
export const $isEmailSubmitted = createStore(false);
export const $isEmailValid = createStore(true);
export const $email = createStore('');
export const $error = createStore<RegisterError>(null);

export const RegisterPage = withStart(pageStarted, () => (
  <CenterCardTemplate>
    <Container>
      <Logotype />
      <Form>
        <Title level={2}>Sign up</Title>
        <BranchIfEmailSubmitted>
          <Text>Check your mailbox.</Text>
          <>
            <Email placeholder="Email" />
            <BranchIfEmailValid>
              <Subtext>
                On the next step you should enter code from received email.
              </Subtext>
              <EmailError />
            </BranchIfEmailValid>
            <Group>
              <Submit text="Continue" variant="primary" />
              <Button
                as={Link}
                text="Sign in"
                variant="text"
                to={path.login()}
              />
            </Group>
          </>
        </BranchIfEmailSubmitted>
      </Form>
      <Footer>
        By joining nameproject you accept our Terms of Service and Privacy
        Policy
      </Footer>
    </Container>
  </CenterCardTemplate>
));

const Form = reflect({
  view: styled.form``,
  bind: {
    onSubmit: formSubmitted,
    disabled: $isSubmitDisabled,
  },
});

const BranchIfEmailSubmitted = reflect({
  view: Branch,
  bind: {
    if: $isEmailSubmitted,
  },
});

const Submit = reflect({
  view: Button,
  bind: {
    type: 'submit',
    disabled: $isSubmitDisabled,
  },
});

const Email = reflect({
  view: Input,
  bind: {
    disabled: $isFormPending,
    value: $email,
    onChange: emailChanged,
  },
});

const BranchIfEmailValid = reflect({
  view: Branch,
  bind: {
    if: every({
      stores: [$isEmailValid, $error.map((err) => err === null)],
      predicate: true,
    }),
  },
});

const errorText = {
  email_already_registered: () => (
    <span>
      Email already registered. <Link to={path.login()}>Sign in?</Link>
    </span>
  ),
  invalid_form: () => (
    <span>
      Maybe you've entered an invalid email, enter another email and try again.
    </span>
  ),
  invalid_payload: () => errorText.invalid_form(),
  default: () => <span>Enter an email</span>,
};

const EmailError = reflect({
  view: ({ error }: { error: RegisterError }) => (
    <Subtext>{errorText[error ?? 'default']()}</Subtext>
  ),
  bind: {
    error: $error,
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

const Footer = styled.footer`
  margin-top: 6rem;
  font-size: 1.2rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: content-box;
  height: 100%;
`;

const Subtext = styled.div`
  font-size: 1.2rem;
`;

const Text = styled.div`
  font-size: 1.8rem;
`;
