import * as React from 'react';
import styled from 'styled-components';
import { Button, Title, Input } from 'woly';
import { useStore, useEvent } from 'effector-react';

import Logo from 'logo.svg';
import { getValue } from 'lib/input';
import { CenterCardTemplate } from '@auth/ui';
import { sendRecoveryEmail } from 'api/access-recovery';
import { useStart, withStart } from 'lib/page-routing';

import * as model from './model';

const changeEmail = model.emailChanged.prepend(getValue);

const mapErrors = (error: model.AccessRecoveryError) => {
  switch (true) {
    case error === 'invalid_email':
      return 'Email is invalid';
    case error === null:
      return;
    default:
      return 'Oops, something went wrong';
  }
};

export const AccessRecoveryPage = withStart(model.start, () => {
  useStart(model.start);
  const formSubmitted = useEvent(model.formSubmitted);

  const email = useStore(model.$email);
  const failure = useStore(model.$failure);
  const isPending = useStore(sendRecoveryEmail.pending);

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
          <Input placeholder="email" value={email} onChange={changeEmail} />

          {failure && <Text>{mapErrors(failure)}</Text>}

          <Group>
            <Button
              type="submit"
              text="Send email"
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

const Text = styled.div`
  font-size: 1.8rem;
`;
