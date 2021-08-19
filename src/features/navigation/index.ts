import { createBrowserHistory } from 'history';
import { createStore, createEvent, merge, sample } from 'effector-root';
import { queryToString } from '../../api/request/common';

export const history =
  process.env.BUILD_TARGET === 'client' ? createBrowserHistory() : null;

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

if (process.env.BUILD_TARGET === 'client') {
  historyPush.watch((url) => history!.push(url));
  historyPushWithParams.watch(({ pathname, params }) =>
    history!.push(`${pathname}${queryToString(params)}`),
  );
  historyReplace.watch((url) => history!.replace(url));
  history!.listen(({ pathname, search, hash }, action) => {
    historyChanged({ pathname, search, hash, action });
  });
} else {
  const events = merge([historyPush, historyReplace]);
  $lastPushed.on(events, (_, url) => url);
  sample({
    source: historyPushWithParams,
    target: historyPush,
    fn: ({ pathname, params }) => `${pathname}${queryToString(params)}`,
  });
}

export { EffectorSsrRedirect } from './lib';
