import { createBrowserHistory } from 'history';
import { createStore, createEvent, merge } from 'effector-root';

export const history =
  process.env.BUILD_TARGET === 'client' ? createBrowserHistory() : null;

export const $lastPushed = createStore('');

export interface HistoryChange {
  pathname: string;
  hash: string;
  search: string;
  action: 'PUSH' | 'POP' | 'REPLACE';
}
export const historyChanged = createEvent<HistoryChange>();

export const historyPush = createEvent<string>();
export const historyReplace = createEvent<string>();

if (process.env.BUILD_TARGET === 'client') {
  historyPush.watch((url) => history!.push(url));
  historyReplace.watch((url) => history!.replace(url));
  history!.listen(({ pathname, search, hash }, action) => {
    historyChanged({ pathname, search, hash, action });
  });
} else {
  const events = merge([historyPush, historyReplace]);
  $lastPushed.on(events, (_, url) => url);
}

export { EffectorSsrRedirect } from './lib';
