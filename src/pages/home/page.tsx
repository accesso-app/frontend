import { reflect, variant } from '@effector/reflect/ssr';
import { createEvent, createStore } from 'effector';
import { useStore } from 'effector-react/scope';
import React from 'react';

import { AccessoCard, ButtonPrimary, FailureText } from 'shared/design';
import { createStart, withStart } from 'shared/lib/page-routing';
import { CenterCardTemplate } from 'shared/ui';

//#region Ports

export const pageStarted = createStart();
export const $fullName = createStore('');
export const $email = createStore('');
export const $showError = createStore(false);

export const logoutClicked = createEvent<React.MouseEvent<HTMLButtonElement>>();

//#endregion

export const HomePage = withStart(pageStarted, () => {
  const fullName = useStore($fullName);
  const email = useStore($email);
  return (
    <CenterCardTemplate>
      <AccessoCard heading={fullName}>
        <ErrorBlock />
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold select-none">Your email</h2>
          <div className="flex flex-row justify-between">
            <div className="text-3xl py-4">{email}</div>
            <LogoutButton>Log out</LogoutButton>
          </div>
        </div>
      </AccessoCard>
    </CenterCardTemplate>
  );
});

const ErrorBlock = variant({
  source: $showError.map(String),
  cases: {
    true: FailureText,
  },
  bind: {
    text: 'Something went wrong! Please, try again later',
  },
});

const LogoutButton = reflect({
  view: ButtonPrimary,
  bind: {
    type: 'button',
    onClick: logoutClicked,
  },
});
