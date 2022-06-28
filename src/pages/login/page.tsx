/* eslint-disable @typescript-eslint/ban-ts-comment */
import { reflect } from '@effector/reflect/ssr';
import { createEvent, createStore } from 'effector';
import { useEvent } from 'effector-react/scope';
import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

import * as design from 'shared/design';
import { DefaultFooter, FailureText } from 'shared/design';
import { path } from 'shared/paths';
import { CenterCardTemplate } from 'shared/ui';

import { Failure } from './types';

//#region Public API

// Model
export const formSubmitted = createEvent<React.FormEvent<HTMLFormElement>>();
export const emailChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const passwordChanged = createEvent<ChangeEvent<HTMLInputElement>>();
export const $email = createStore('');
export const $password = createStore('');
export const $formDisabled = createStore(false);
export const $formPending = createStore(false);
export const $error = createStore<Failure | null>(null);

const $errorText = $error.map((failure) => {
  switch (failure) {
    case 'invalid_credentials':
      return 'Looks like your password or email is invalid. Please, try again.';
    case 'invalid_form':
      return 'Form is filled incorrect, please check for typos.';
    case 'empty_form':
      return 'Please, fill form fields before continue.';
    case 'invalid_payload':
    case 'unexpected':
      return 'Something wrong is happened. Please, reload page or try again later.';
    case null:
      return null;
    default:
      return null;
  }
});

//#endregion

export const LoginPage = () => {
  return (
    <CenterCardTemplate>
      <design.AccessoCard heading="Sign in to Accesso account" footer={<DefaultFooter />}>
        <Form>
          <design.Field label="Email">
            <Email placeholder="name@domain.com" autoComplete="email" />
          </design.Field>
          <design.Field label="Password">
            <Password type="password" placeholder="p@s$w03d" autoComplete="current-password" />
          </design.Field>

          <Group>
            <Submit />
            {/* @ts-ignore */}
            <design.Button as={Link} to={path.register()}>
              Register
            </design.Button>
            {/*<design.Button>Reset password</design.Button>*/}
          </Group>
          <ErrorBlock />
        </Form>
      </design.AccessoCard>
    </CenterCardTemplate>
  );
};

const Form: React.FC = (props) => {
  const onSubmit = useEvent(formSubmitted);

  return (
    <form onSubmit={onSubmit} className="space-y-8 flex flex-col">
      {props.children}
    </form>
  );
};

formSubmitted.watch((event) => event.preventDefault());

const Email = reflect({
  view: design.Input,
  bind: {
    disabled: $formDisabled,
    value: $email,
    onChange: emailChanged,
  },
});

const Password = reflect({
  view: design.Input,
  bind: {
    disabled: $formDisabled,
    value: $password,
    onChange: passwordChanged,
  },
});

const Submit = reflect({
  view: design.ButtonPrimary,
  bind: {
    type: 'submit',
    disabled: $formDisabled,
    children: $formPending.map((pending) => (pending ? 'Sending…' : 'Sign in')),
  },
});

const ErrorBlock = reflect({
  bind: { text: $errorText },
  view: FailureText,
});

const Group: React.FC = (props) => <div className="flex flex-row space-x-4">{props.children}</div>;
