import * as React from 'react';
import styled from 'styled-components';
import { Button, Title, Input } from 'woly';
import { Link } from 'react-router-dom';
import { useStore, useEvent } from 'effector-react/ssr';

import Logo from 'logo.svg';
import { path } from 'pages/paths';
import { withStart, useStart } from 'lib/page-routing';
import { Branch } from 'lib/branch';
import { CenterCardTemplate } from '@auth/ui';

import * as model from './model';

export const RegisterPage = withStart(model.pageLoaded, () => {
  useStart(model.pageLoaded);

  const isSubmitEnabled = useStore(model.$isSubmitEnabled);
  const isEmailSubmitted = useStore(model.$emailSubmitted);
  const formSubmitted = useEvent(model.formSubmitted);

  const handleSubmit = React.useCallback(
    (event) => {
      event.preventDefault();
      formSubmitted(event);
    },
    [formSubmitted],
  );

  return (
    <CenterCardTemplate>
      <Container>
        <Logotype />

        <form onSubmit={handleSubmit}>
          <Title level={2}>Sign up</Title>
          <Branch if={isEmailSubmitted}>
            <Text>Check your mailbox.</Text>
            <>
              <Email />
              <Group>
                <Button
                  disabled={!isSubmitEnabled}
                  type="submit"
                  text="Continue"
                  variant="primary"
                />
                <Button
                  as={Link}
                  text="Sign in"
                  variant="text"
                  to={path.login()}
                />
              </Group>
            </>
          </Branch>
        </form>
        <Footer>
          By joining nameproject you accept our Terms of Service and Privacy
          Policy
        </Footer>
      </Container>
    </CenterCardTemplate>
  );
});

const failureText = {
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
  invalid_payload: () => failureText.invalid_form(),
  default: () => <span>Enter an email</span>,
};

const Email: React.FC = () => {
  const isDisabled = useStore(model.$formPending);
  const isValid = useStore(model.$isEmailValid);
  const email = useStore(model.$email);
  const failure = useStore(model.$failure);
  const onChange = useEvent(model.emailChanged);

  return (
    <>
      <Input
        disabled={isDisabled}
        placeholder="email"
        value={email}
        onChange={onChange}
      />
      <Branch if={isValid && failure === null}>
        <Subtext>
          On the next step you should enter code from received email.
        </Subtext>
        <Subtext>{failureText[failure ?? 'default']()}</Subtext>
      </Branch>
    </>
  );
};

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

const Subtext = styled.div`
  font-size: 1.2rem;
`;

const Text = styled.div`
  font-size: 1.8rem;
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
