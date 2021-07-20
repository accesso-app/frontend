import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { historyPush } from 'features/navigation';
import { useEvent } from 'effector-react/ssr';
import { path } from '../paths';
import { OAuthAuthorizePage } from './authorize';
import { OAuthAccessoDonePage } from './accesso-done';

export const OAuthPage = () => {
  return (
    <Switch>
      <Route exact path={path.oauth.authorize()}>
        <OAuthAuthorizePage />
      </Route>
      <Route exact path={path.oauth.accessoDone()}>
        <OAuthAccessoDonePage />
      </Route>
      <Route path="*">
        <Redirect />
      </Route>
    </Switch>
  );
};

const Redirect = () => {
  const push = useEvent(historyPush);
  useEffect(() => {
    push(path.login());
  }, [push]);
  return null;
};
