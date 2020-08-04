import * as React from 'react';
import { withStart, useStart } from 'lib/page-routing';

import * as model from './model';

export const OAuthAuthorizePage = () => {
  // useStart(model.pageLoaded);

  return null;
};
withStart(model.pageLoaded, OAuthAuthorizePage);
