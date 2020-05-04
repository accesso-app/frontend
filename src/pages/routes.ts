import { path } from './paths';

import { Error404Page } from './error404';
import { HomePage } from './home';
import { LoginPage } from './login';
import { OAuthAuthorizePage } from './oauth/authorize';
import { RegisterConfirmPage } from './register/confirm';
import { RegisterPage } from './register';

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
    path: path.oauthAuthorize(),
    exact: true,
    component: OAuthAuthorizePage,
  },
  {
    path: path.registerConfirm(':code'),
    exact: true,
    component: RegisterConfirmPage,
  },
  {
    path: '*',
    component: Error404Page,
  },
];
