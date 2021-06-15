import { checkAuthenticated, $session } from 'features/session';
import { createStart } from 'lib/page-routing';
import { createStore, sample } from 'effector-root';

export const pageStarted = createStart();

export const $fullName = createStore<string>('');

sample({
  source: $session,
  target: $fullName,
  fn: (session) => `${session?.firstName} ${session?.lastName}`,
});

checkAuthenticated({ when: pageStarted });
