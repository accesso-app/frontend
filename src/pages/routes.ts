import { path } from './paths';

import { Error404Page } from './error404';
import { HomePage } from './home';
import { LoginPage } from './login';
import { RegisterPage } from './register';
import { RegisterConfirmPage } from './register/confirm';

export const routes = [
  {
    path: path.home(),
    exact: true,
    component: HomePage,
  },
  {
    path: path.login(),
    exact: true,
    component: LoginPage,
  },
  {
    path: path.register(),
    exact: true,
    component: RegisterPage,
  },
  {
    path: path.registerConfirm(),
    exact: true,
    component: RegisterConfirmPage,
  },
  {
    path: '*',
    component: Error404Page,
  },
];
