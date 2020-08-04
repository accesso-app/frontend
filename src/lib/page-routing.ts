import * as React from 'react';
import { Event, createEvent } from 'effector';
import { useEvent } from 'effector-react/ssr';
import { useParams, useLocation } from 'react-router';

const START = `☄️/start-event`;

export type StartParams = {
  params: Record<string, string>;
  query: Record<string, string>;
};

/**
 * Creates event to handle universal page loading
 */
export function createStart(...params: any): Event<StartParams> {
  return createEvent(...params);
}

/**
 * Loades start event on browser side and pass params and query
 */
export function useStart(
  startEvent: Event<StartParams>,
  endEvent?: Event<void>,
) {
  const params = useParams();
  const location = useLocation();
  const query = React.useMemo(
    () => Object.fromEntries(new URLSearchParams(location.search)),
    [location.search],
  );
  const start = useEvent(startEvent);

  React.useEffect(() => {
    start({ params, query });
    return () => (endEvent ? endEvent() : undefined);
  }, []);
}

/**
 * Ejects start event from component
 */
export function getStart<T>(component: T): undefined | Event<StartParams> {
  return component[START];
}

/**
 * Assign start event to component
 */
export function withStart<P extends {}>(
  event: Event<StartParams>,
  component: React.FC<P>,
): React.FC<P> {
  component[START] = event;
  return component;
}
