import * as React from 'react';
import styled from 'styled-components';
import { Button, Title, Input } from 'woly';
import { useStore, useEvent } from 'effector-react';

import Logo from 'logo.svg';
import { CenterCardTemplate } from '@auth/ui';

import * as model from './model';
import { Failure } from './components';

export const AccessRecoveryPage = () => {
  const emailChanged = useEvent(model.emailChanged);
  const formSubmitted = useEvent(model.formSubmitted);

  const email = useStore(model.$email);

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
          <Title level={2}>Access Recovery</Title>

          <Input placeholder="email" value={email} onChange={emailChanged} />

          <Failure />

          <Group>
            <Button type="submit" text="Send email" variant="primary" />
          </Group>
        </form>
      </Container>
    </CenterCardTemplate>
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: content-box;
  height: 100%;
`;
