import React from 'react';

interface Extendable {
  as?: React.ComponentType<any> | string;
}

export const Input = (props: React.HTMLProps<HTMLInputElement> & Extendable) => {
  const Component = props.as ?? 'input';
  return (
    <Component
      {...(props as never)}
      className={
        'inline-block font-light text-4xl px-8 py-4 rounded-md bg-white border border-solid border-1 border-gray-300 ' +
        ' placeholder:text-gray-400' +
        ' focus:border-black focus:ring-2 focus:ring-primary focus:outline-none focus:ring-offset-0' +
        ' disabled:bg-gray-100 disabled:placeholder:text-gray-300 disabled:border-gray-200'
      }
    />
  );
};
