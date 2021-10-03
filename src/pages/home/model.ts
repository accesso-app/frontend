import { checkAuthenticated, $session } from 'features/session';
import { createStart } from 'lib/page-routing';
import { attach, createEvent, createStore, guard, sample } from 'effector-root';
import * as api from '../../api';
import { historyPush } from '../../features/navigation';

export const pageStarted = createStart();

export const logout = createEvent<void>();

export const $fullName = createStore<string>('');
export const $email = createStore<string>('');
export const $showError = createStore<boolean>(false);

const sessionDeleteFx = attach({ effect: api.sessionDelete });
const pageReady = checkAuthenticated({ when: pageStarted });

sample({
  source: $session,
  target: $fullName,
  fn: (session) => `${session?.firstName} ${session?.lastName}`,
});

sample({
  source: $session,
  target: $email,
  fn: (session) => session?.email || '',
});

sample({
  source: guard({
    source: logout,
    filter: sessionDeleteFx.pending.map((is) => !is),
  }),
  target: sessionDeleteFx,
  fn: (_) => ({ body: { deleteAllSessions: true } }),
});

sample({
  source: api.sessionDelete.done,
  target: historyPush,
  fn: (_) => '/login',
});

$showError.reset(pageReady).on(sessionDeleteFx.fail, (_) => true);

checkAuthenticated({ when: pageStarted });
