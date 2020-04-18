import * as React from 'react';
import styled from 'styled-components';
import { Button, Title, Input } from 'woly';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { useStore, useEvent } from 'effector-react/ssr';

import { assignStart } from 'lib/effector';
import { path } from 'pages/paths';
import Logo from 'logo.svg';
import { CenterCardTemplate } from '@auth/ui';

import * as model from './model';
import { Branch } from 'lib/branch';

export const RegisterConfirmPage = () => {
  const { code } = useParams();

  const isSubmitDisabled = useStore(model.$isSubmitDisabled);
  const pageLoaded = useEvent(model.pageLoaded);
  const formSubmitted = useEvent(model.formSubmitted);

  React.useEffect(() => {
    pageLoaded({ code: code! });
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

        <form onSubmit={handleSubmit}>
          <Title level={2}>Sign up confirmation</Title>

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
            <Button as={Link} text="Sign in" variant="text" to={path.login()} />
          </Group>
        </form>
        <Footer>
          By joining nameproject you accept our Terms of Service and Privacy
          Policy
        </Footer>
      </Container>
    </CenterCardTemplate>
  );
};

assignStart(RegisterConfirmPage, model.pageLoaded);

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
