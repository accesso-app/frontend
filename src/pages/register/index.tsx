import * as React from 'react';
import styled from 'styled-components';
import { Button, Title, Input } from 'woly';

import { useStore, useEvent } from 'effector-react/ssr';
import { START } from 'lib/effector';
import Logo from 'logo.svg';
import { CenterCardTemplate } from '@auth/ui';

// import * as model from './model';

export const RegisterPage = () => {
  // const pageLoaded = useEvent(model.pageLoaded);
  // React.useEffect(() => pageLoaded(), []);

  return (
    <CenterCardTemplate>
      <Container>
        <Logotype />

        <form>
          <Title level={2}>Sign up</Title>

          <Input placeholder="email" value="" onChange={() => {}} />
          <Input placeholder="display name" value="" onChange={() => {}} />
          <Input placeholder="password" value="" onChange={() => {}} />
          <Input placeholder="repeat password" value="" onChange={() => {}} />

          <Group>
            <Button text="Sign up" variant="primary" />
            <Button text="Sign in" variant="text" />
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

// RegisterPage[START] = model.pageLoaded;

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
  margin-top: 10rem;
  font-size: 1.2rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: content-box;
  height: 100%;
`;
