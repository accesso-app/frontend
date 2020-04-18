import * as React from 'react';
import { Event } from 'effector';

const START = `☄️/start-event`;
type Params = Record<string, string>;

export function getStart<T>(component: T): undefined | Event<Params> {
  return component[START];
}

export function assignStart(
  component: React.Component | React.FC,
  event: Event<Params>,
) {
  component[START] = event;
}

export function splitMap<
  S,
  Cases extends Record<string, (payload: S) => any | undefined>
>(
  source: Event<S>,
  cases: Cases,
): {
  [K in keyof Cases]: Cases[K] extends (p: S) => infer R
    ? Event<Exclude<R, undefined>>
    : never;
} & { __: Event<S> } {
  const result: Record<string, Event<S>> = {};

  // let current: Event<S> = is.store(unit) ? (unit: any).updates : unit
  let current = source;
  for (const key in cases) {
    if (key in cases) {
      const fn = cases[key];

      result[key] = current.filterMap(fn);
      current = current.filter({
        fn: (data) => !fn(data),
      });
    }
  }

  // eslint-disable-next-line no-underscore-dangle
  result.__ = current;

  return result as {
    [K in keyof Cases]: Cases[K] extends (p: S) => infer R
      ? Event<Exclude<R, undefined>>
      : never;
  } & { __: Event<S> };
}
