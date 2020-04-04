import {
  createEffect,
  createEvent,
  createStore,
  guard,
  forward,
} from 'lib/effector';
import { historyReplace } from 'features/navigation';

export const pageLoaded = createEvent();

forward({
  from: pageLoaded,
  to: historyReplace.prepend(() => '/login'),
});

// export const incrementClicked = createEvent<any>();
// export const resetClicked = createEvent<any>();

// const getRandomInitialFx = createEffect<void, number>();

// export const $counterValue = createStore<number>(0);
// export const $pagePending = getRandomInitialFx.pending;

// const $shouldGetNumber = $counterValue.map((value) => value === 0);

// guard({
//   source: pageLoaded,
//   filter: $shouldGetNumber,
//   target: getRandomInitialFx,
// });

// $counterValue
//   .on(getRandomInitialFx.done, (_, { result }) => result)
//   .on(incrementClicked, (value) => value + 1)
//   .on(resetClicked, () => 0);

// getRandomInitialFx.use(
//   () =>
//     new Promise((resolve) =>
//       setTimeout(resolve, 200, Math.floor(Math.random() * 300)),
//     ),
// );
