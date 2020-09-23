import * as React from 'react';
import styled from 'styled-components';
import { Button, Input, Title } from 'woly';
import { useEvent, useStore } from 'effector-react';

import Logo from 'logo.svg';
import { getValue } from 'lib/input';
import { CenterCardTemplate } from '@auth/ui';
import { withStart, useStart } from 'lib/page-routing';

import * as model from './model';

const handlePasswordChanged = model.passwordChanged.prepend(getValue);
const handleRePasswordChanged = model.rePasswordChanged.prepend(getValue);

export const AccessRecoveryConfirmPage = withStart(model.pageStart, () => {
  useStart(model.pageStart);

  const formSubmitted = useEvent(model.formSubmitted);

  const password = useStore(model.$password);
  const rePassord = useStore(model.$rePassword);
  const failure = useStore(model.$failure);

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
        <Title level={2}>Access Recovery</Title>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="New password"
            value={password}
            onChange={handlePasswordChanged}
          />
          <Input
            placeholder="Repeat password"
            value={rePassord}
            onChange={handleRePasswordChanged}
          />

          {failure && <div>Something went wrong</div>}

          <Group>
            <Button type="submit" text="Save password" variant="primary" />
          </Group>
        </form>
      </Container>
    </CenterCardTemplate>
  );
});

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

const Group = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 3rem;

  & *:not(:first-child) {
    margin-left: 2rem;
  }
`;
