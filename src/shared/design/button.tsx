import React from 'react';

interface Extendable {
  as?: any;
  [key: string]: any;
}

type Props<T> = Omit<React.HTMLProps<T>, 'as'> & Extendable;

export function Button({ as, ...props }: Props<HTMLButtonElement>) {
  const Component = as ?? 'button';
  return (
    <Component
      {...(props as never)}
      className={
        'inline-block font-light text-3xl px-10 py-4 rounded-md bg-white select-none' +
        ' hover:bg-gray-100 active:bg-gray-500 active:text-white' +
        ' focus:ring-2 focus:ring-primary focus:outline-none focus:ring-offset-0' +
        ' disabled:cursor-default disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200 disabled:hover:text-gray-400'
      }
    />
  );
}

export const ButtonPrimary = ({ as, ...props }: Props<HTMLButtonElement>) => {
  const Component = as ?? 'button';
  return (
    <Component
      type="submit"
      {...(props as never)}
      className={
        'inline-block font-light text-3xl px-10 py-4 rounded-md text-white bg-black select-none' +
        ' hover:bg-gray-500 active:bg-gray-700 disabled:cursor-default' +
        ' focus:ring-2 focus:ring-primary focus:outline-none focus:ring-offset-2' +
        ' disabled:cursor-default disabled:bg-gray-400 disabled:text-gray-300 disabled:hover:bg-gray-400 disabled:hover:text-gray-300'
      }
    />
  );
};
