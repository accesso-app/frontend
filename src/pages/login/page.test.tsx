import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { root, fork, Scope, hydrate } from 'effector-root';
import { Provider } from 'effector-react/ssr';

import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {
  $email,
  $failure,
  $formDisabled,
  $formPending,
  $password,
  LoginPage,
} from './page';
import { path } from 'pages/paths';

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
    hydrate(scope, { values: new Map().set($failure, 'invalid_credentials') });
    render(<LoginPage />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText(/invalid email or password/i));
  });

  test('invalid_form', async () => {
    hydrate(scope, { values: new Map().set($failure, 'invalid_form') });
    render(<LoginPage />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText(/try to enter a valid email/i));
  });

  test('invalid_payload', async () => {
    hydrate(scope, { values: new Map().set($failure, 'invalid_payload') });
    render(<LoginPage />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText(/something wrong/i));
  });

  test('unexpected', async () => {
    hydrate(scope, { values: new Map().set($failure, 'unexpected') });
    render(<LoginPage />, { wrapper: Wrapper });
    await waitFor(() => screen.getByText(/something wrong/i));
  });
});
