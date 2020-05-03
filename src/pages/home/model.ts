import { createEvent, forward } from 'effector-root';
import { checkAuthenticated } from 'features/session';

export const pageLoaded = createEvent<Record<string, string>>();

const pageReady = checkAuthenticated({ when: pageLoaded });
