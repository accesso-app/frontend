import React from 'react';

import Logo from '../assets/logo.svg';
import { Heading2 } from './typography';

interface Props {
  heading?: string;
  footer?: React.ReactChild | null;
}

export const AccessoCard: React.FC<Props> = ({ heading, children, footer }) => (
  <div className="flex flex-col justify-between box-content h-full">
    <div className="flex mb-6">
      <Logo />
    </div>
    <div className="flex flex-col space-y-8">
      <Heading2>{heading}</Heading2>
      {children}
    </div>
    {footer ? <footer className="text-xl mt-6">{footer}</footer> : null}
  </div>
);
