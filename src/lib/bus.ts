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
  for (const [from, to, map] of config.events) {
    if (map) forward({ from: from.map(map), to });
    else forward({ from, to });
  }
  for (const [from, to] of config.stores) {
    forward({ from, to });
    to.defaultState = from.defaultState;
  }
}
