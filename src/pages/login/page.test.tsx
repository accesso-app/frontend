import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { root, fork, Scope, hydrate } from 'effector-root';
import { Provider } from 'effector-react/ssr';

import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { LoginPage, $email, $password, $formPending } from './page';
import { path } from 'pages/paths';

let scope: Scope;

beforeEach(() => {
  scope = fork(root);
});

const Wrapper: React.FC = ({ children }) => (
  <MemoryRouter initialEntries={[path.login()]}>
    <Provider value={scope}>{children}</Provider>
  </MemoryRouter>
);

test('render on default states', async () => {
  render(<LoginPage />, { wrapper: Wrapper });
  const email = await screen.findByPlaceholderText('email');
  const password = await screen.findByPlaceholderText('password');

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

  const email = await screen.findByPlaceholderText('email');
  const password = await screen.findByPlaceholderText('password');

  expect(email).toHaveValue('example@domain.dev');
  expect(password).toHaveValue('qweasd123');
});

test('render on pending states', async () => {
  hydrate(scope, {
    values: new Map().set($formPending, true),
  });

  render(<LoginPage />, { wrapper: Wrapper });

  const button = await screen.findByText(/sending/);

  expect(button).toHaveAttribute('type', 'submit');
});
