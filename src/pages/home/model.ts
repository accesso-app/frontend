import { createEvent, forward } from 'effector-root';
import { historyReplace } from 'features/navigation';
import { routes } from 'pages/routes';

export const pageLoaded = createEvent();

forward({
  from: pageLoaded,
  to: historyReplace.prepend(routes.login),
});
