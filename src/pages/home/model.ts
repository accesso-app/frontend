import { createEvent, forward } from 'effector-root';
import { historyReplace } from 'features/navigation';
import { path } from 'pages/paths';

export const pageLoaded = createEvent<Record<string, string>>();

forward({
  from: pageLoaded,
  to: historyReplace.prepend(path.login),
});
