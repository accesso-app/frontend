import { attach, createEvent, createStore, guard, sample } from 'effector';
import { not } from 'patronum';

import { historyPush } from 'features/navigation';
import { $session, checkAuthenticated } from 'features/session';

import * as api from 'shared/api';
import { createStart } from 'shared/lib/page-routing';

export const pageStarted = createStart();

export const logout = createEvent<void>();

export const $fullName = createStore<string>('');
export const $email = createStore<string>('');
export const $showError = createStore<boolean>(false);

const sessionDeleteFx = attach({ effect: api.sessionDelete });
const pageReady = checkAuthenticated({ when: pageStarted });

sample({
  clock: $session,
  fn: (session) => `${session?.firstName} ${session?.lastName}`,
  target: $fullName,
});

sample({
  clock: $session,
  fn: (session) => session?.email ?? '',
  target: $email,
});

sample({
  clock: logout,
  filter: not(sessionDeleteFx.pending),
  fn: () => ({ body: { deleteAllSessions: true } }),
  target: sessionDeleteFx,
});

sample({
  clock: api.sessionDelete.done,
  fn: (_) => '/login',
  target: historyPush,
});

$showError.reset(pageReady).on(sessionDeleteFx.fail, (_) => true);
