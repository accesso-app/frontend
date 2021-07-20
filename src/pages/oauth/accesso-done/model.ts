import { createStart } from '../../../lib/page-routing';
import { checkAuthenticated } from '../../../features/session';

export const pageStarted = createStart();

const pageReady = checkAuthenticated({ when: pageStarted });
