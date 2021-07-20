import { path } from './paths';

import { Error404Page } from './error404';
import { HomePage } from './home';
import { LoginPage } from './login';
import { OAuthPage } from './oauth/page';
import { RegisterConfirmPage } from './register/confirm';
import { RegisterPage } from './register';
import { AccessRecoveryPage } from './access-recovery';
import { AccessRecoveryConfirmPage } from './access-recovery/confirm';

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
    path: path.registerConfirm(':code'),
    exact: true,
    component: RegisterConfirmPage,
  },
  {
    path: path.accessRecovery(),
    exact: true,
    component: AccessRecoveryPage,
  },
  {
    path: path.accessRecoveryConfirm(':code'),
    exact: true,
    component: AccessRecoveryConfirmPage,
  },
  {
    path: path.oauth.base(),
    component: OAuthPage,
  },
  {
    path: '*',
    component: Error404Page,
  },
];
