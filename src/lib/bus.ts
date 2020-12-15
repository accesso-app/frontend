import { forward, is, Event, Store } from 'effector-root';

// https://t.me/ts_ru/123234
type Equal<A, B> = (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B
  ? 1
  : 2
  ? true
  : false;

export function bus<E, S>(config: {
  events: Array<
    E extends [Event<infer A>, Event<infer B>, (value: infer Aa) => infer Bb]
      ? [Equal<A, Aa>, Equal<B, Bb>] extends [true, true]
        ? E
        : never
      : E extends [Event<infer A>, Event<infer B>]
      ? Equal<A, B> extends true
        ? E
        : never
      : never
  >;
  stores: Array<
    S extends [Store<infer A>, Store<infer B>]
      ? Equal<A, B> extends true
        ? S
        : never
      : never
  >;
}) {
  for (const [fromEvent, toEvent, mapFn] of config.events) {
    if (mapFn) forward({ from: fromEvent.map(mapFn), to: toEvent });
    else forward({ from: fromEvent, to: toEvent });
  }

  for (const [fromStore, toStore] of config.stores) {
    forward({ from: fromStore, to: toStore });

    toStore.defaultState = fromStore.defaultState;

    // It's overrides initial value on toStore
    // https://t.me/c/1489066599/4652
    (toStore as any).stateRef.before = [
      {
        type: 'map',
        fn: (state: unknown) => state,
        from: (fromStore as any).stateRef,
      },
    ];
  }
}
