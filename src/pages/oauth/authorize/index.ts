import React from 'react';
import { withStart } from 'lib/page-routing';

import * as model from './model';

export const OAuthAuthorizePage = withStart(model.pageLoaded, () => {
  return null;
});
