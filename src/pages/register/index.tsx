import * as React from 'react';
import styled from 'styled-components';
import { Button, Title, Input } from 'woly';
import { Link } from 'react-router-dom';
import { useStore, useEvent } from 'effector-react/ssr';

import { path } from 'pages/paths';
import { START } from 'lib/effector';
import Logo from 'logo.svg';
import { CenterCardTemplate } from '@auth/ui';

import * as model from './model';
import { Branch } from 'lib/branch';

export const RegisterPage = () => {
  const pageLoaded = useEvent(model.pageLoaded);
  React.useEffect(() => pageLoaded(), []);

  const formSubmitted = useEvent(model.formSubmitted);
  const isDisabled = useStore(model.$formDisabled);

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
          <Email />
          <Group>
            <Button
              disabled={isDisabled}
              type="submit"
              text="Continue"
              variant="primary"
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

RegisterPage[START] = model.pageLoaded;

const Email: React.FC = () => {
  const email = useStore(model.$email);
  const onChange = useEvent(model.emailChanged);
  const isValid = useStore(model.$isEmailValid);

  return (
    <>
      <Input placeholder="email" value={email} onChange={onChange} />
      <Branch if={isValid}>
        <Subtext>
          On the next step you should enter code from received email.
        </Subtext>
        <Subtext>Enter email</Subtext>
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
