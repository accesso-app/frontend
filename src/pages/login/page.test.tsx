import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { root, fork, Scope, hydrate } from 'effector-root';
import { Provider } from 'effector-react/ssr';

import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { path } from 'pages/paths';
import {
  $email,
  $error,
  $formDisabled,
  $formPending,
  $password,
  emailChanged,
  formSubmitted,
  LoginPage,
  passwordChanged,
} from './page';

let scope: Scope;

beforeEach(() => {
  scope = fork(root);
});

const selectors = {
  email: async () => screen.findByPlaceholderText('email'),
  password: async () => screen.findByPlaceholderText('password'),
  submit: async () => (await screen.getAllByText(/sign in/i))[1],
  submitInProgress: async () => screen.getByText(/sending/i),
};

const Wrapper: React.FC = ({ children }) => (
  <MemoryRouter initialEntries={[path.login()]}>
    <Provider value={scope}>{children}</Provider>
  </MemoryRouter>
);

test('render on default states', async () => {
  render(<LoginPage />, { wrapper: Wrapper });

  const email = await selectors.email();
  const password = await selectors.password();
  const submit = await selectors.submit();

  expect(email).not.toBeDisabled();
  expect(password).not.toBeDisabled();
  expect(submit).not.toBeDisabled();

  expect(email).toHaveValue('');
  expect(password).toHaveValue('');
  expect(submit).toHaveTextContent(/sign in/i);
});

test('render on filled states', async () => {
  hydrate(scope, {
    values: new Map()
      .set($email, 'example@domain.dev')
      .set($password, 'qweasd123'),
  });

  render(<LoginPage />, { wrapper: Wrapper });

  const email = await selectors.email();
  const password = await selectors.password();

  expect(email).toHaveValue('example@domain.dev');
  expect(password).toHaveValue('qweasd123');
});

test('pending state changes submit text', async () => {
  hydrate(scope, {
    values: new Map().set($formPending, true),
  });

  render(<LoginPage />, { wrapper: Wrapper });

  const button = await selectors.submitInProgress();

  expect(button).toHaveAttribute('type', 'submit');
});

test('submit button by default have sign in text', async () => {
  render(<LoginPage />, { wrapper: Wrapper });

  const button = await selectors.submit();

  expect(button).toHaveAttribute('type', 'submit');
});

test('disabled form disable all fields and submit', async () => {
  hydrate(scope, { values: new Map().set($formDisabled, true) });
  render(<LoginPage />, { wrapper: Wrapper });

  const email = await selectors.email();
  const password = await selectors.password();
  const submit = await selectors.submit();

  expect(email).toBeDisabled();
  expect(password).toBeDisabled();
  expect(submit).toBeDisabled();
});

describe('failure set text in failure block', () => {
  test('invalid_credentials', async () => {
    hydrate(scope, { values: new Map().set($error, 'invalid_credentials') });
    render(<LoginPage />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText(/invalid email or password/i));
  });

  test('invalid_form', async () => {
    hydrate(scope, { values: new Map().set($error, 'invalid_form') });
    render(<LoginPage />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText(/try to enter a valid email/i));
  });

  test('invalid_payload', async () => {
    hydrate(scope, { values: new Map().set($error, 'invalid_payload') });
    render(<LoginPage />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText(/something wrong/i));
  });

  test('unexpected', async () => {
    hydrate(scope, { values: new Map().set($error, 'unexpected') });
    render(<LoginPage />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText(/something wrong/i));
  });
});

describe('events', () => {
  const submitFn = jest.fn();
  formSubmitted.watch(submitFn);

  const emailChangeFn = jest.fn();
  emailChanged.watch(emailChangeFn);

  const passwordChangeFn = jest.fn();
  passwordChanged.watch(passwordChangeFn);

  beforeEach(() => {
    submitFn.mockReset();
    emailChangeFn.mockReset();
    passwordChangeFn.mockReset();
  });

  test('pageLoaded', async () => {
    render(<LoginPage />, { wrapper: Wrapper });

    expect(submitFn).toHaveBeenCalledTimes(0);
    expect(emailChangeFn).toHaveBeenCalledTimes(0);
    expect(passwordChangeFn).toHaveBeenCalledTimes(0);
  });

  test('formSubmitted', async () => {
    render(<LoginPage />, { wrapper: Wrapper });
    const submit = await selectors.submit();

    // TODO: test form submit on Enter in input
    fireEvent.click(submit);

    expect(submitFn).toHaveBeenCalledTimes(1);
    expect(emailChangeFn).toHaveBeenCalledTimes(0);
    expect(passwordChangeFn).toHaveBeenCalledTimes(0);
  });

  test('emailChanged', async () => {
    render(<LoginPage />, { wrapper: Wrapper });
    const email = await selectors.email();

    fireEvent.change(email, { target: { value: 'demo' } });

    expect(emailChangeFn).toHaveBeenCalledTimes(1);
    expect(submitFn).toHaveBeenCalledTimes(0);
    expect(passwordChangeFn).toHaveBeenCalledTimes(0);
  });

  test('passwordChanged', async () => {
    render(<LoginPage />, { wrapper: Wrapper });
    const password = await selectors.password();

    fireEvent.change(password, { target: { value: 'qweasd' } });

    expect(passwordChangeFn).toHaveBeenCalledTimes(1);
    expect(submitFn).toHaveBeenCalledTimes(0);
    expect(emailChangeFn).toHaveBeenCalledTimes(0);
  });
});
