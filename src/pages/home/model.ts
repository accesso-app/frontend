import { createEvent, forward } from 'effector-root';
import { historyReplace } from 'features/navigation';
import { path } from 'pages/paths';

export const pageLoaded = createEvent();

forward({
  from: pageLoaded,
  to: historyReplace.prepend(path.login),
});
