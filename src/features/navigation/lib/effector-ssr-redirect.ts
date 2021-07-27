import { useEffect } from 'react';
import { useEvent } from 'effector-react/ssr';
import { historyPush } from '../index';

export const EffectorSsrRedirect = ({ href }: { href: string }) => {
  const push = useEvent(historyPush);
  useEffect(() => {
    push(href);
  }, [push, href]);
  return null;
};
