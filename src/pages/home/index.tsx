import * as React from 'react';
import { useEvent, useStore } from 'effector-react/ssr';
import styled from 'styled-components';

import { withStart, useStart } from 'lib/page-routing';
import * as model from './model';

export const HomePage = withStart(model.pageLoaded, () => {
  useStart(model.pageLoaded);

  return (
    <section>
      <h2>Hello world! Effector SSR example</h2>
    </section>
  );
});

const Button = styled.button`
  background-color: transparent;
  border: 1px solid lightblue;
  padding: 1rem;
  border-radius: 1rem;
`;
