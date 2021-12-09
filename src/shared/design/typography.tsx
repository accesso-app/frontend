import React from 'react';

interface Extendable {
  as?: React.ComponentType<any> | string;
}

export const Heading2 = (props: React.HTMLProps<HTMLHeadingElement> & Extendable) => {
  const Component = props.as ?? 'h2';
  return <Component {...(props as never)} className="font-light text-6xl py-4" />;
};
