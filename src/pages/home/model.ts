import { checkAuthenticated, $session } from 'features/session';
import { createStart } from 'lib/page-routing';
import { attach, createEvent, createStore, guard, sample } from 'effector-root';
import * as api from '../../api';
import { sessionDelete } from '../../api';
import { historyPush } from '../../features/navigation';

export const pageStarted = createStart();

export const logout = createEvent<void>();

export const $fullName = createStore<string>('');

const sessionDeleteFx = attach({ effect: api.sessionDelete });

sample({
  source: $session,
  target: $fullName,
  fn: (session) => `${session?.firstName} ${session?.lastName}`,
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
  source: sessionDelete.done,
  target: historyPush,
  fn: (_) => '/login',
});

checkAuthenticated({ when: pageStarted });
