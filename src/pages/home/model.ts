import { createEvent, forward } from 'lib/effector';
import { historyReplace } from 'features/navigation';

export const pageLoaded = createEvent();

forward({
  from: pageLoaded,
  to: historyReplace.prepend(() => '/login'),
});
