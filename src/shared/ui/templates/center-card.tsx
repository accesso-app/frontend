import * as React from 'react';
import styled, { Styled } from 'styled-components';
import { Block } from 'woly';

interface Props {
  children: React.ReactNode;
}

const wrap = (props: Props) => ({
  children: <Block>{props.children}</Block>,
});

export const CenterCardTemplate: Styled<Props> = styled.div.attrs(wrap)`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  overflow-y: auto;

  & ${Block} {
    width: 100%;
    max-width: 60rem;
    box-sizing: border-box; /* remove after woly: 0.1.4 */
    flex-shrink: 0;
  }

  @media screen and (max-width: 550px) {
    & ${Block} {
      min-height: 100vh;
    }
    justify-content: flex-start;
  }
`;
