import * as effector from 'effector';
export * from 'effector';

export const rootDomain = effector.createDomain('rootDomain');

if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
  const { attachLogger } = require('effector-logger/attach');
  attachLogger(rootDomain);
}

export const {
  createDomain,
  createEffect,
  createEvent,
  createStore,
} = rootDomain;

export const START = `☄️/start-event`;
