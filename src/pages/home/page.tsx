import React from 'react';
import { withStart, createStart } from 'lib/page-routing';

export const pageStarted = createStart();

export const HomePage = withStart(pageStarted, () => (
  <section>
    <h2>Hello world! Effector SSR example</h2>
  </section>
));
