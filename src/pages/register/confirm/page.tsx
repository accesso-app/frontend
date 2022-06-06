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
import { path } from 'shared/paths';
import { CenterCardTemplate } from 'shared/ui';

//#region Public API
type Failures =
  | 'code_invalid_or_expired'
  | 'email_already_activated'
  | 'invalid_form'
  | 'invalid_payload'
  | 'empty_first_name'
  | 'empty_last_name'
  | 'empty_password'
  | 'incorrect_password_repeat';

export const $displayName = createStore('');
export const $firstName = createStore('');
export const $lastName = createStore('');
export const $password = createStore('');
export const $repeat = createStore('');
export const $failure = createStore<null | Failures>(null);

export const $isRegistrationFinished = createStore(false);
export const $isFormPending = createStore(false);

export const formSubmitted = createEvent();
export const firstNameChanged = createEvent<string>();
export const lastNameChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const repeatChanged = createEvent<string>();
//#endregion

export const RegisterConfirmPage = () => {
  const isRegistrationFinished = useStore($isRegistrationFinished);

  return (
    <CenterCardTemplate>
      {isRegistrationFinished ? <WelcomeMessage /> : <AccountCreation />}
    </CenterCardTemplate>
  );
};

export const WelcomeMessage = () => {
  const displayName = useStore($displayName);

  return (
    <AccessoCard heading="Welcome to Accesso!">
      <div className="flex flex-col space-y-8 items-start">
        <Heading3>
          {displayName}, now you can access all our projects.
          <br />
          But before enter your credentials on sign in page
        </Heading3>
        <ButtonPrimary as={Link} to={path.login()}>
          Log in
        </ButtonPrimary>
      </div>
    </AccessoCard>
  );
};

export const AccountCreation = () => {
  const formSubmit = useEvent(formSubmitted);
  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formSubmit();
  }, []);

  return (
    <form className="flex flex-col justify-between box-content h-full" onSubmit={handleSubmit}>
      <AccessoCard heading="Continue registration">
        <Heading3>
          You've been invited to join our projects!
          <br />
          Create an Accesso account to access them.
        </Heading3>
        <div className="flex flex-col space-y-8 xs:space-y-0 xs:space-x-4 xs:flex-row">
          <Field required label="First name">
            <FirstName autoComplete="given-name" />
          </Field>
          <Field required label="Last name">
            <LastName autoComplete="family-name" />
          </Field>
        </div>
        <Field required label="Set a password">
          <Password autoComplete="new-password" type="password" />
        </Field>
        <Field required label="Confirm the password">
          <PasswordRepeat autoComplete="new-password" type="password" />
        </Field>
        <Errors />
        <div className="flex space-x-4">
          <RegisterButton type="submit">Register account</RegisterButton>
          <Button as={Link} to={path.login()}>
            Log in
          </Button>
        </div>
      </AccessoCard>
    </form>
  );
};

const FirstName = reflect({
  view: Input,
  bind: {
    value: $firstName,
    onChange: firstNameChanged.prepend(
      (event: ChangeEvent<HTMLInputElement>) => event.target.value,
    ),
    disabled: $isFormPending,
  },
});

const LastName = reflect({
  view: Input,
  bind: {
    value: $lastName,
    onChange: lastNameChanged.prepend((event: ChangeEvent<HTMLInputElement>) => event.target.value),
    disabled: $isFormPending,
  },
});

const Password = reflect({
  view: Input,
  bind: {
    value: $password,
    onChange: passwordChanged.prepend((event: ChangeEvent<HTMLInputElement>) => event.target.value),
    disabled: $isFormPending,
  },
});

const PasswordRepeat = reflect({
  view: Input,
  bind: {
    value: $repeat,
    onChange: repeatChanged.prepend((event: ChangeEvent<HTMLInputElement>) => event.target.value),
    disabled: $isFormPending,
  },
});

const RegisterButton = reflect({
  view: ButtonPrimary,
  bind: {
    disabled: $isFormPending,
  },
});

const failures: { [K in Failures]: () => React.ReactElement } = {
  code_invalid_or_expired: () => (
    <>Invitation code is expired or completely invalid. Request a new one</>
  ),
  email_already_activated: () => (
    <span className="text-black select-none">Wow! Your email already activated! ↓</span>
  ),
  empty_first_name: () => <>Please, fill first name field</>,
  empty_last_name: () => <>Please, fill last name field</>,
  empty_password: () => <>Please, set a password, and correctly repeat it</>,
  incorrect_password_repeat: () => <>Looks like password repeat does not match original password</>,
  invalid_form: () => <>Please, verify each field in form and try again.</>,
  invalid_payload: () => <>Oh! We're sorry :( Something goes wrong. Try again later.</>,
};

const Errors = () => {
  const failure = useStore($failure);

  if (failure) {
    const Element = failures[failure];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!Element)
      return <FailureText text={`Unexpected error happened with code: "${failure}" 😣`} />;
    return <FailureText text={<Element />} />;
  }
  return <FailureText />;
};
