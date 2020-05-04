import { createEvent, forward } from 'effector-root';
import { checkAuthenticated } from 'features/session';
import { StartParams } from 'lib/page-routing';

export const pageLoaded = createEvent<StartParams>();

const pageReady = checkAuthenticated({ when: pageLoaded });
