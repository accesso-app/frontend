import { useEffect } from 'react';
import { useEvent } from 'effector-react/ssr';
import { historyPush } from '../index';

/**
 * A component similar to 'Redirect' from 'react-router'
 * need to use this instead of original component,
 * because the one from 'react-router' does not work with ssr
 * */
export const EffectorSsrRedirect = ({ href }: { href: string }) => {
  const push = useEvent(historyPush);
  useEffect(() => {
    push(href);
  }, [push, href]);
  return null;
};
