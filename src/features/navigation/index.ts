import { createEvent, createStore, merge, Scope, scopeBind } from 'effector';
import { createBrowserHistory } from 'history';

export const history = process.env.BUILD_TARGET === 'client' ? createBrowserHistory() : null;

export const $lastPushed = createStore('');

export interface HistoryChange {
  pathname: string;
  hash: string;
  search: string;
  action: 'PUSH' | 'POP' | 'REPLACE';
}

export interface HistoryWithParamsProps {
  pathname: string;
  params: Record<string, string>;
}

export const historyChanged = createEvent<HistoryChange>();

export const historyPush = createEvent<string>();
export const historyPushWithParams = createEvent<HistoryWithParamsProps>();
export const historyReplace = createEvent<string>();

export function initializeClientHistory(scope: Scope) {
  historyPush.watch((url) => history?.push(url));
  historyReplace.watch((url) => history?.replace(url));
  historyPushWithParams.watch((params) => history?.push(params));
  const boundHistoryChange = scopeBind(historyChanged, { scope });
  history?.listen(({ pathname, search, hash }, action) => {
    boundHistoryChange({ pathname, search, hash, action });
  });
}

export function initializeServerHistory() {
  const historyUpdate = merge([historyPush, historyReplace]);
  $lastPushed.on(historyUpdate, (_, url) => url);
}
