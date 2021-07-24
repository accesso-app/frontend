import React from 'react';

import { withStart, createStart } from 'lib/page-routing';

export const pageStarted = createStart();

export const OAuthAuthorizePage = withStart(pageStarted, () => {
  return null;
});
