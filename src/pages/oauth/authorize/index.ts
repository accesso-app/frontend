import { contract } from 'shared/lib/contract';

import * as model from './model';
import * as page from './page';

export { OAuthAuthorizePage } from './page';

contract({ page, model });
