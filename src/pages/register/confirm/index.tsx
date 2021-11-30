import Logo from 'app/logo.svg';
import { useEvent, useStore } from 'effector-react/ssr';
import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Input, Title } from 'woly';

import { path } from 'pages/paths';

import { CenterCardTemplate } from 'shared/ui';

import { Branch } from 'lib/branch';
import { withStart } from 'lib/page-routing';

import * as model from './model';

export const RegisterConfirmPage = withStart(model.pageStart, () => {
  const isSubmitDisabled = useStore(model.$isSubmitDisabled);
  const isRegistrationFinished = useStore(model.$isRegistrationFinished);
  const formSubmitted = useEvent(model.formSubmitted);

  const handleSubmit = React.useCallback(
    (event) => {
      event.preventDefault();
      formSubmitted();
    },
    [formSubmitted],
  );

  return (
    <CenterCardTemplate>
      <Container>
        <Logotype />

        <Branch if={isRegistrationFinished}>
          <>
            <Welcome />
            <Group>
              <Button as={Link} text="Sign in" variant="primary" to={path.login()} />
            </Group>
          </>
          <>
            <form onSubmit={handleSubmit}>
              <Title level={2}>Sign up confirmation</Title>

              <Failure />

              <DisplayName />
              <br />
              <Passwords />

              <Group>
                <Button
                  disabled={isSubmitDisabled}
                  type="submit"
                  text="Confirm registration"
                  variant="primary"
                />
                <Group data-direction="column">
                  <Button as={Link} text="It's not my invite" variant="text" to={path.register()} />
                  <Button
                    as={Link}
                    text="I'm already registered"
                    variant="text"
                    to={path.login()}
                  />
                </Group>
              </Group>
            </form>
          </>
        </Branch>
        <Footer>By joining Accesso you accept our Terms of Service and Privacy Policy</Footer>
      </Container>
    </CenterCardTemplate>
  );
});

const Welcome = () => {
  const name = useStore(model.$displayName);

  return <Title level={2}>You are welcome, {name}!</Title>;
};

const DisplayName: React.FC = () => {
  const name = useStore(model.$displayName);
  const isValid = useStore(model.$isDisplayNameValid);
  const isPending = useStore(model.$isFormPending);
  const onChange = useEvent(model.displayNameChanged);

  return (
    <>
      <Input disabled={isPending} placeholder="display name" value={name} onChange={onChange} />
      <Branch if={name.length === 0}>
        <Subtext>Enter your First name and Last name</Subtext>
        <Branch if={isValid}>
          <Subtext>&nbsp;</Subtext>
          <Subtext data-style="failure">What about Last name?</Subtext>
        </Branch>
      </Branch>
    </>
  );
};

const Passwords: React.FC = () => {
  const isPending = useStore(model.$isFormPending);
  const password = useStore(model.$password);
  const passwordChanged = useEvent(model.passwordChanged);
  const repeat = useStore(model.$repeat);
  const repeatChanged = useEvent(model.repeatChanged);
  const isPasswordValid = useStore(model.$isPasswordValid);

  return (
    <>
      <Input
        placeholder="enter new password"
        type="password"
        value={password}
        disabled={isPending}
        // autoComplete="new-password"
        onChange={passwordChanged}
      />
      <Input
        placeholder="repeat password"
        type="password"
        value={repeat}
        disabled={isPending}
        // autoComplete="new-password"
        onChange={repeatChanged}
      />
      <Branch if={!isPasswordValid && repeat.length > 3}>
        <Subtext data-style="failure">Looks like your password is not match confirmation</Subtext>
      </Branch>
    </>
  );
};

const failureText = {
  code_invalid_or_expired: () => (
    <span>
      Code invalid or expired,{' '}
      <a href="https://t.me/joinchat/WLsDNClpU3phOWIy">request another one in chat</a>
    </span>
  ),
  email_already_activated: () => (
    <span>
      Wow! This email is already activated. <Link to={path.login()}>Login</Link> or{' '}
      <a href="https://t.me/joinchat/WLsDNClpU3phOWIy">request another one in chat</a>
    </span>
  ),
  invalid_form: () => <span>Please, retype your form, we found unexpected errors.</span>,
  invalid_payload: () => failureText.invalid_form(),
};

const Failure = () => {
  const failure = useStore(model.$failure);

  if (failure === null) {
    return null;
  }

  return <Subtext data-style="failure">{failureText[failure]()}</Subtext>;
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
  align-items: flex-start;

  & *:not(:first-child) {
    margin-left: 2rem;
  }

  &[data-direction='column'] {
    flex-direction: column;

    margin-top: 0;
    & *:not(:first-child) {
      margin-left: 0;
      margin-top: 1rem;
    }
  }
`;

const Subtext = styled.div`
  font-size: 1.5rem;
  &[data-style='failure'] {
    color: red;
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
