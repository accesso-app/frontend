import * as React from 'react';
import styled from 'styled-components';

import Logo from 'logo.svg';
import { withStart } from 'lib/page-routing';
import { CenterCardTemplate } from '@auth/ui';

import { Button, Title } from 'woly';
import { Link } from 'react-router-dom';
import { path } from '../paths';
import * as model from './model';

export const RegisterPage = withStart(model.pageLoaded, () => {
  return (
    <CenterCardTemplate>
      <Container>
        <Logotype />
        <Title>Registration closed at the moment</Title>
        <Title level={3}>
          You can obtain an invitation by{' '}
          <a href="https://t.me/joinchat/WLsDNClpU3phOWIy">
            joining our early adopters chat
          </a>
        </Title>
        <SignInButton
          as={Link}
          text="Sign in"
          variant="text"
          to={path.login()}
        />
      </Container>
    </CenterCardTemplate>
  );
});

// Remove padding for better visualisation
const SignInButton = styled(Button)`
  &[data-size='default'] {
    padding: 0;
  }
`;

const Logotype = styled(Logo)`
  margin-bottom: 3rem;
  display: flex;
  flex-shrink: 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: content-box;
  height: 100%;
`;
