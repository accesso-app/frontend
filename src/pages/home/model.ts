import { attach, createEvent, createStore, sample } from 'effector';
import { not, spread } from 'patronum';

import { historyPush } from 'features/navigation';
import { $session, checkAuthenticated } from 'features/session';

import * as api from 'shared/api';
import { createStart } from 'shared/lib/page-routing';

import { Application } from './types';

export const pageStarted = createStart();

export const logoutClicked = createEvent();

export const $fullName = createStore<string>('');
export const $email = createStore<string>('');
export const $showError = createStore<boolean>(false);
export const $applicationsInstalled = createStore<Application[]>([]);
export const $applicationsAvailable = createStore<Application[]>([]);

const sessionDeleteFx = attach({ effect: api.sessionDelete });
const applicationsListFx = attach({ effect: api.applicationsList });
const pageReady = checkAuthenticated({ when: pageStarted });

$showError.reset(pageReady);

sample({
  clock: pageReady,
  fn: () => ({ body: {} }),
  target: applicationsListFx,
});

spread({
  source: applicationsListFx.doneData.map((response) => response.answer),
  targets: {
    available: $applicationsAvailable,
    installed: $applicationsInstalled,
  },
});

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
  clock: logoutClicked,
  filter: not(sessionDeleteFx.pending),
  fn: () => ({ body: { deleteAllSessions: true } }),
  target: sessionDeleteFx,
});

sample({
  clock: sessionDeleteFx.done,
  fn: (_) => '/login',
  target: historyPush,
});

$showError.on(sessionDeleteFx.fail, () => true);
$showError.on(applicationsListFx.fail, () => true);
