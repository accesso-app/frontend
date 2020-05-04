import * as React from 'react';
import styled from 'styled-components';
import { Button, Title, Input } from 'woly';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { useStore, useEvent } from 'effector-react/ssr';

import { assignStart } from 'lib/page-routing';
import { Branch } from 'lib/branch';
import { path } from 'pages/paths';
import { CenterCardTemplate } from '@auth/ui';
import Logo from 'logo.svg';

import * as model from './model';

export const RegisterConfirmPage = () => {
  const params = useParams();

  const isSubmitDisabled = useStore(model.$isSubmitDisabled);
  const isRegistrationFinished = useStore(model.$isRegistrationFinished);
  const pageLoaded = useEvent(model.pageLoaded);
  const formSubmitted = useEvent(model.formSubmitted);

  React.useEffect(() => {
    pageLoaded({ params, query: {} });
  }, []);

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
              <Button
                as={Link}
                text="Sign in"
                variant="primary"
                to={path.login()}
              />
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
                  text="Sign up"
                  variant="primary"
                />
                <Button
                  as={Link}
                  text="Enter email again"
                  variant="text"
                  to={path.register()}
                />
                <Button
                  as={Link}
                  text="Sign in"
                  variant="text"
                  to={path.login()}
                />
              </Group>
            </form>
          </>
        </Branch>
        <Footer>
          By joining nameproject you accept our Terms of Service and Privacy
          Policy
        </Footer>
      </Container>
    </CenterCardTemplate>
  );
};

assignStart(RegisterConfirmPage, model.pageLoaded);

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
      <Input
        disabled={isPending}
        placeholder="display name"
        value={name}
        onChange={onChange}
      />
      <Branch if={name.length === 0}>
        <Subtext>Enter your First name and Last name</Subtext>
        <Branch if={isValid}>
          <Subtext>&nbsp;</Subtext>
          <Subtext>What about Last name?</Subtext>
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
        <Subtext>Looks like your password is not match confirmation</Subtext>
      </Branch>
    </>
  );
};

const failureText = {
  code_invalid_or_expired: () => (
    <span>
      Code invalid or expired,{' '}
      <Link to={path.register()}>request another one</Link>
    </span>
  ),
  email_already_activated: () => (
    <span>
      Wow! This email is already activated. <Link to={path.login()}>Login</Link>{' '}
      or <Link to={path.register()}>enter another one</Link>.
    </span>
  ),
  invalid_form: () => (
    <span>Please, retype your form, we found unexpected errors.</span>
  ),
  invalid_payload: () => failureText.invalid_form(),
};

const Failure = () => {
  const failure = useStore(model.$failure);

  if (failure === null) {
    return null;
  }

  return <Subtext>{failureText[failure]()}</Subtext>;
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
