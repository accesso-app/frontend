import { reflect } from '@effector/reflect/ssr';
import { createEvent, createStore } from 'effector';
import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Input, Title } from 'woly';

import { path } from 'pages/paths';

import { CenterCardTemplate } from 'shared/ui';

import { createStart, withStart } from 'lib/page-routing';

import Logo from '../../app/logo.svg';
import { Failure } from './types';

// Model
export const pageStarted = createStart();
export const formSubmitted = createEvent<React.FormEvent<HTMLFormElement>>();
export const emailChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const passwordChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const $email = createStore('');
export const $password = createStore('');
export const $formDisabled = createStore(false);
export const $formPending = createStore(false);
export const $error = createStore<Failure | null>(null);

const $errorText = $error.map((failure) => {
  switch (failure) {
    case 'invalid_credentials':
      return 'Invalid email or password.';
    case 'invalid_form':
      return 'Form filled incorrect. Try to enter a valid email and password again.';
    case 'invalid_payload':
    case 'unexpected':
      return 'Something wrong happened. Reload page and try again. If nothing changed, please try again later.';
    case null:
      return null;
    default:
      return null;
  }
});

export const LoginPage = withStart(pageStarted, () => {
  return (
    <CenterCardTemplate>
      <Container>
        <Logotype />

        <Form>
          <Title level={2}>Sign in</Title>
          <ErrorBlock />

          <Email placeholder="email" />
          <Password type="password" placeholder="password" />

          <Group>
            <Submit variant="primary" />
            <Button as={Link} to={path.register()} text="Register" variant="text" />
            {/*<Button*/}
            {/*  as={Link}*/}
            {/*  to={path.accessRecovery()}*/}
            {/*  text="Reset password"*/}
            {/*  variant="text"*/}
            {/*/>*/}
          </Group>
        </Form>
        <Footer>By joining Accesso you accept our Terms of Service and Privacy Policy</Footer>
      </Container>
    </CenterCardTemplate>
  );
});

const Form = reflect({
  view: styled.form``,
  bind: {
    onSubmit: formSubmitted,
    // TODO remove after merge https://github.com/EvgenyiFedotov/@effector/reflect/pull/4
    'data-demo': $email,
    placeholder: 'asdasd',
  },
});
formSubmitted.watch((event) => event.preventDefault());

const Email = reflect({
  view: Input,
  bind: {
    disabled: $formDisabled,
    value: $email,
    onChange: emailChanged,
  },
});

const Password = reflect({
  view: Input,
  bind: {
    disabled: $formDisabled,
    value: $password,
    onChange: passwordChanged,
  },
});

const Submit = reflect({
  view: Button,
  bind: {
    type: 'submit',
    disabled: $formDisabled,
    text: $formPending.map((pending) => (pending ? 'Sending…' : 'Sign in')),
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

const Footer = styled.footer`
  margin-top: 6rem;
  font-size: 1.2rem;
`;

const Fail = styled.div`
  font-size: 1.3rem;
  margin-bottom: 1rem;
`;
