import { reflect } from '@effector/reflect/ssr';
import { createEvent, createStore } from 'effector';
import { useEvent, useStore } from 'effector-react/scope';
import React, { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';

import {
  AccessoCard,
  Button,
  ButtonPrimary,
  FailureText,
  Field,
  Heading3,
  Input,
} from 'shared/design';
import { CenterCardTemplate } from 'shared/ui';

import { path } from '../paths';

//#region Public API
export const haveInviteClicked = createEvent();
export const inviteCodeChanged = createEvent<string>();
export const continueWithInviteClicked = createEvent();
export const alreadyRegisteredInviteClicked = createEvent();

export const $mode = createStore<'request' | 'invite'>('request');
export const $inviteCode = createStore('');
export const $isInviteValid = createStore(true);

//#endregin

const $isCodeEmpty = $inviteCode.map((code) => code.trim().length === 0);

const ourChatLink = 'https://t.me/joinchat/WLsDNClpU3phOWIy';

const Registration = () => {
  return (
    <AccessoCard heading="Register closed at the moment">
      <Heading3>
        You can obtain an invitation by{' '}
        <a
          className="text-blue-500 hover:underline no-underline visited:text-violet-600"
          target="_blank"
          referrerPolicy="no-referrer"
          href={ourChatLink}
        >
          joining our chat
        </a>
      </Heading3>
      <div className="flex mt-8 space-x-4">
        <ViaInvite>I have an invite</ViaInvite>
        <Button as={Link} to={path.login()}>
          Log in
        </Button>
      </div>
    </AccessoCard>
  );
};

const EnterCode = () => {
  const continueWithInvite = useEvent(continueWithInviteClicked);
  const alreadyRegistered = useEvent(alreadyRegisteredInviteClicked);
  const isValidInvite = useStore($isInviteValid);
  const isEmptyInvite = useStore($isCodeEmpty);

  const handleSubmit = React.useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      continueWithInvite();
    },
    [continueWithInvite],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-between box-content h-full">
      <AccessoCard heading="Use your invite code">
        <Field label="Enter invite code provided by our team">
          <InviteCode placeholder="just-four-words-code" />
        </Field>
        <FailureText
          text={
            !isValidInvite && !isEmptyInvite
              ? 'Looks, like your invite code is invalid. Please, copy-paste it'
              : null
          }
        />
        <div className="flex space-x-4">
          <ContinueInvite type="submit">Continue</ContinueInvite>
          <Button as={Link} to={path.login()} onClick={alreadyRegistered}>
            Already registered
          </Button>
        </div>
      </AccessoCard>
    </form>
  );
};

export const RegisterPage = () => (
  <CenterCardTemplate>
    {useStore($mode) === 'request' ? <Registration /> : <EnterCode />}
  </CenterCardTemplate>
);

const ViaInvite = reflect({
  view: ButtonPrimary,
  bind: {
    onClick: haveInviteClicked.prepend(() => {}),
  },
});

const ContinueInvite = reflect({
  view: ButtonPrimary,
  bind: {
    disabled: $isInviteValid.map((is) => !is),
  },
});

const InviteCode = reflect({
  view: Input,
  bind: {
    value: $inviteCode,
    onChange: inviteCodeChanged.prepend(
      (event: ChangeEvent<HTMLInputElement>) => event.target.value,
    ),
  },
});
