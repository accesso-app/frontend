import {
  createStore,
  createEvent,
  combine,
  guard,
  Unit,
  Event,
  forward,
} from 'effector';
import { SessionCreateDone, sessionDelete, sessionGet } from 'api';
import { historyPush } from 'features/navigation';
import { path } from 'pages/paths';

type SessionUser = SessionCreateDone['answer'];

export const readyToLoadSession = createEvent<void>();

export const sessionLoaded = sessionGet.finally;

export const $session = createStore<SessionUser | null>(null);
export const $isAuthenticated = $session.map((user) => user !== null);

// Show loading state if no session but first request is sent
export const $sessionPending = combine(
  [$session, sessionGet.pending],
  ([session, pending]) => !session && pending,
);

$session
  .on(sessionGet.doneData, (_, { answer }) => answer.user)
  //TODO probably session should be filled on create too, otherwise next request on server won`t get session
  .on(sessionGet.failData, (session, { status }) => {
    if (status === 'unauthorized') {
      return null;
    }
    return session;
  })
  .on(sessionDelete.done, () => null);

guard({
  source: readyToLoadSession,
  filter: $sessionPending.map((is) => !is),
  target: sessionGet.prepend(() => ({})),
});

/**
 * If user not authenticated, redirect to login
 */
export function checkAuthenticated<T>(config: {
  when: Unit<T>;
  continue?: Unit<T>;
  stop?: Unit<T>;
}): Event<T> {
  const continueLogic = config.continue ?? createEvent();
  const stopLogic = config.stop ?? historyPush.prepend(path.login);
  guard({
    source: config.when,
    filter: $isAuthenticated,
    target: continueLogic,
  });
  guard({
    source: config.when,
    filter: $isAuthenticated.map((is) => !is),
    target: stopLogic,
  });

  const result = createEvent<T>();
  forward({
    from: continueLogic,
    to: result,
  });
  return result;
}

/**
 * If user **anonymous**, continue, else redirect to home
 */
export function checkAnonymous<T>(config: {
  when: Unit<T>;
  continue?: Unit<T>;
  stop?: Unit<T>;
}): Event<T> {
  const continueLogic = config.continue ?? createEvent<T>();
  const stopLogic = config.stop ?? historyPush.prepend(path.home);
  guard({
    source: config.when,
    filter: $isAuthenticated,
    target: stopLogic,
  });
  guard({
    source: config.when,
    filter: $isAuthenticated.map((is) => !is),
    target: continueLogic,
  });

  const result = createEvent<T>();
  forward({
    from: continueLogic,
    to: result,
  });
  return result;
}
