import * as React from 'react';
import { Event } from 'effector';

const START = `☄️/start-event`;
export type StartParams = {
  params: Record<string, string>;
  query: Record<string, string>;
};

export function getStart<T>(component: T): undefined | Event<StartParams> {
  return component[START];
}

export function assignStart(
  component: React.Component | React.FC,
  event: Event<StartParams>,
) {
  component[START] = event;
}
