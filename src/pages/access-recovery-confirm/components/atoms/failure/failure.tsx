import * as React from 'react';
import styled from 'styled-components';
import { useStore } from 'effector-react';

import { $failure } from '../../../model';

export function Failure() {
  const failure = useStore($failure);

  if (!failure) return null;

  return <Text>Email is not valid</Text>;
}

const Text = styled.div`
  font-size: 1.8rem;
`;
