import * as React from 'react';
import { useEvent, useStore } from 'effector-react/ssr';
import styled from 'styled-components';

import { assignStart } from 'lib/page-routing';
import * as model from './model';

export const HomePage = () => {
  const pageLoaded = useEvent(model.pageLoaded);
  React.useEffect(() => {
    pageLoaded({ params: {}, query: {} });
  }, []);

  return (
    <section>
      <h2>Hello world! Effector SSR example</h2>
    </section>
  );
};

assignStart(HomePage, model.pageLoaded);

const Button = styled.button`
  background-color: transparent;
  border: 1px solid lightblue;
  padding: 1rem;
  border-radius: 1rem;
`;
