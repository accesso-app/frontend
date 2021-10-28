import * as React from 'react';
import styled from 'styled-components';

import Logo from 'logo.svg';
import { withStart } from 'lib/page-routing';
import { CenterCardTemplate } from '@auth/ui';

import { Button, Title, Input } from 'woly';
import { Link } from 'react-router-dom';
import { useStore, useEvent } from 'effector-react/ssr';
import { reflect } from '@effector/reflect/ssr';
import { path } from '../paths';
import * as model from './model';

const Registration = () => (
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
      <Group>
        <ButtonPrimary
          as={Link}
          text="I already registered"
          variant="primary"
          to={path.login()}
        />
        <Button
          text="I have an invite code"
          variant="text"
          onClick={useEvent(model.haveInviteClicked)}
        />
      </Group>
    </Container>
  </CenterCardTemplate>
);

const $isCodeEmpty = model.$inviteCode.map((code) => code.trim().length === 0);
const EnterCode = () => {
  const isValidInvite = useStore(model.$isInviteValid);
  const isEmptyInvite = useStore($isCodeEmpty);
  return (
    <CenterCardTemplate>
      <Container>
        <Logotype />
        <Title>Invitation</Title>
        <Title level={3}>Please, enter your code</Title>
        <Invite placeholder="just-paste-code-here" />
        {!isValidInvite && !isEmptyInvite ? (
          <Subtext data-style="failure">
            Looks, like your invite code is invalid. Please, copy-paste it
          </Subtext>
        ) : null}
        <Group>
          <ButtonPrimary
            as="button"
            variant="primary"
            text="Continue"
            disabled={!isValidInvite}
            onClick={useEvent(model.continueWithInviteClicked)}
          />
          <Button
            as={Link}
            variant="text"
            text="I'm already registered"
            to={path.login()}
            onClick={useEvent(model.alreadyRegisteredInviteClicked)}
          />
        </Group>
      </Container>
    </CenterCardTemplate>
  );
};

const Invite = reflect({
  view: Input,
  bind: {
    value: model.$inviteCode,
    onChange: model.inviteCodeChanged.prepend((event) => event.target.value),
  },
});

export const RegisterPage = withStart(model.pageLoaded, () => {
  const mode = useStore(model.$mode);

  if (mode === 'request') return <Registration />;

  return <EnterCode />;
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

const ButtonPrimary = styled(Button)`
  text-decoration: none;
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
  &[data-style='failure'] {
    color: red;
  }
`;
