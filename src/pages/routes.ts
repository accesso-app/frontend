import { Error404Page } from './error404';
import { HomePage } from './home';
import { LoginPage } from './login';

export const routes = {
  home: () => '/home',
  login: () => '/login',
};

export const ROUTES = [
  {
    path: routes.home(),
    exact: true,
    component: HomePage,
  },
  {
    path: routes.login(),
    exact: true,
    component: LoginPage,
  },
  {
    path: '*',
    component: Error404Page,
  },
];
