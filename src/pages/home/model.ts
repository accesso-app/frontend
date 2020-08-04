import 'effector-root';
import { checkAuthenticated } from 'features/session';
import { createStart } from 'lib/page-routing';

export const pageLoaded = createStart();

const pageReady = checkAuthenticated({ when: pageLoaded });
