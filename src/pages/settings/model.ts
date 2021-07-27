import { createStart } from 'lib/page-routing';
import { checkAuthenticated } from '../../features/session';

export const pageStarted = createStart();
checkAuthenticated({ when: pageStarted });
