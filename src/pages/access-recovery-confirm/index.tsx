import * as React from 'react';
import styled from 'styled-components';
import { Button, Input, Title } from 'woly';
import { useEvent, useStore } from 'effector-react';

import Logo from 'logo.svg';
import { getValue } from 'lib/input';
import { CenterCardTemplate } from '@auth/ui';
import { changePassword } from 'api/access-recovery';
import { withStart } from 'lib/page-routing';

import * as model from './model';

const mapErrors = (error: model.AccessRecoveryConfirmError) => {
  switch (true) {
    case error === 'password_too_short':
      return 'Password should be at least 8 letters long';
    case error === 'repeat_password_wrong':
      return 'Confirm password does not match';
    case error === 'invalid_email':
      return 'Email is not valid';
    case error === 'invalid_password':
      return 'Password is not valid';
    case error === null:
      return null;
    default:
      return 'Oops, something went wrong';
  }
};

const handlePasswordChanged = model.passwordChanged.prepend(getValue);
const handleRePasswordChanged = model.rePasswordChanged.prepend(getValue);

export const AccessRecoveryConfirmPage = withStart(model.pageStart, () => {
  const formSubmitted = useEvent(model.formSubmitted);

  const isPending = useStore(changePassword.pending);
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

          {failure && <Text>{mapErrors(failure)}</Text>}

          <Group>
            <Button
              type="submit"
              text="Save password"
              variant="primary"
              disabled={isPending}
            />
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

const Text = styled.div`
  font-size: 1.8rem;
`;
