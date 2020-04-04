import { Error404Page } from './error404';
import { HomePage } from './home';
import { LoginPage } from './login';

export const ROUTES = [
  {
    path: '/',
    exact: true,
    component: HomePage,
  },
  {
    path: '/login',
    exact: true,
    component: LoginPage,
  },
  {
    path: '*',
    component: Error404Page,
  },
];
