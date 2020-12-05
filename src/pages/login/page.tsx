import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { Button, Title, Input } from 'woly';
import { Link } from 'react-router-dom';

import { createEvent, createStore } from 'effector-root';
import { useStore, useEvent } from 'effector-react/ssr';
import { withStart, useStart, createStart } from 'lib/page-routing';
import Logo from 'logo.svg';
import { CenterCardTemplate } from '@auth/ui';

import { path } from 'pages/paths';
import { Failure } from './model';

// Model
export const pageLoaded = createStart();
export const formSubmitted = createEvent();
export const emailChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const passwordChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const $email = createStore('');
export const $password = createStore('');
export const $formDisabled = createStore(false);
export const $formPending = createStore(false);
export const $failure = createStore<Failure | null>(null);

const $failureText = $failure.map(failureReadable);

export const LoginPage = withStart(pageLoaded, () => {
  useStart(pageLoaded);

  const handleEmail = useEvent(emailChanged);
  const handlePassword = useEvent(passwordChanged);
  const handleSubmit = useEvent(formSubmitted);

  const onSubmit = React.useCallback(
    (event) => {
      event.preventDefault();
      handleSubmit();
    },
    [handleSubmit],
  );

  const formDisabled = useStore($formDisabled);
  const formPending = useStore($formPending);
  const email = useStore($email);
  const password = useStore($password);

  const failure = useStore($failureText);

  return (
    <CenterCardTemplate>
      <Container>
        <Logotype />

        <form onSubmit={onSubmit}>
          <Title level={2}>Sign in</Title>

          {failure && <Fail>{failure}</Fail>}

          <Input
            placeholder="email"
            disabled={formDisabled}
            value={email}
            onChange={handleEmail}
          />
          <Input
            type="password"
            placeholder="password"
            disabled={formDisabled}
            value={password}
            onChange={handlePassword}
          />

          <Group>
            <Button
              type="submit"
              disabled={formDisabled}
              text={formPending ? 'Sending…' : 'Sign in'}
              variant="primary"
            />
            <Button
              as={Link}
              to={path.register()}
              text="Sign up"
              variant="text"
            />
            <Button
              as={Link}
              to={path.accessRecovery()}
              text="Reset password"
              variant="text"
            />
          </Group>
        </form>
        <Footer>
          By joining nameproject you accept our Terms of Service and Privacy
          Policy
        </Footer>
      </Container>
    </CenterCardTemplate>
  );
});

function failureReadable(failure: Failure | null) {
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
  }
}

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
