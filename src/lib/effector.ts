import * as effector from 'effector-logger';
export * from 'effector-logger';

export const rootDomain = effector.createDomain('rootDomain');

export const {
  createDomain,
  createEffect,
  createEvent,
  createStore,
} = rootDomain;

export const START = `☄️/start-event`;
