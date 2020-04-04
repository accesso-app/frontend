import { createBrowserHistory } from 'history';
import { createStore, createEvent, merge } from 'lib/effector';

export const history =
  process.env.BUILD_TARGET === 'client' ? createBrowserHistory() : null;

export const $lastPushed = createStore('');

export const historyPush = createEvent<string>();
export const historyReplace = createEvent<string>();

if (process.env.BUILD_TARGET === 'client') {
  historyPush.watch((url) => history!.push(url));
  historyReplace.watch((url) => history!.replace(url));
} else {
  $lastPushed.on(merge([historyPush, historyReplace]), (_, url) => url);
}
