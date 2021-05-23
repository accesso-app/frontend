import 'effector-root';
import { checkAuthenticated } from 'features/session';
import { createStart } from 'lib/page-routing';

export const pageStarted = createStart();

checkAuthenticated({ when: pageStarted });
