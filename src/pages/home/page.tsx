import { reflect, variant } from '@effector/reflect/ssr';
import { createEvent, createStore } from 'effector';
import { useList, useStore } from 'effector-react/scope';
import React from 'react';

import { AccessoCard, ButtonPrimary, FailureText } from 'shared/design';
import { CenterCardTemplate } from 'shared/ui';

import { Application } from './types';

//#region Ports
export const logoutClicked = createEvent<React.MouseEvent<HTMLButtonElement>>();

export const $fullName = createStore('');
export const $email = createStore('');
export const $showError = createStore(false);
export const $applicationsInstalled = createStore<Application[]>([]);
export const $applicationsAvailable = createStore<Application[]>([]);
//#endregion

export const HomePage = () => {
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
        <InstalledApplications />
        <AvailableApplications />
      </AccessoCard>
    </CenterCardTemplate>
  );
};

function InstalledApplications() {
  const installed = useStore($applicationsInstalled);
  if (installed.length === 0) return null;

  return (
    <ApplicationsSection title="Installed applications">
      {installed.map((application) => (
        <div key={application.id}>{application.title}</div>
      ))}
    </ApplicationsSection>
  );
}

function AvailableApplications() {
  const available = useStore($applicationsAvailable);
  if (available.length === 0) return null;

  return (
    <ApplicationsSection title="Available to install">
      {available.map((application) => (
        <div key={application.id}>{application.title}</div>
      ))}
    </ApplicationsSection>
  );
}

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

function ApplicationsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode | null;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold select-none">{title}</h2>
      <div className="flex flex-col space-y-4 text-3xl">{children}</div>
    </div>
  );
}
