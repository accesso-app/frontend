import * as React from 'react';
import { useEvent, useStore } from 'effector-react/ssr';
import styled from 'styled-components';

import { START } from 'lib/effector';
import * as model from './model';

const Button = styled.button`
  background-color: transparent;
  border: 1px solid lightblue;
  padding: 1rem;
  border-radius: 1rem;
`;

export const HomePage = () => {
  const pageLoaded = useEvent(model.pageLoaded);
  React.useEffect(() => pageLoaded(), []);

  return (
    <section>
      <h2>Hello world! Effector SSR example</h2>
    </section>
  );
};

HomePage[START] = model.pageLoaded;
