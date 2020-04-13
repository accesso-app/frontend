import { createEvent, forward } from 'effector-root';
import { historyReplace } from 'features/navigation';

export const pageLoaded = createEvent();

forward({
  from: pageLoaded,
  to: historyReplace.prepend(() => '/login'),
});
