import { Unit, is, forward } from 'effector';

export function contract<T extends Record<string, unknown>>(config: {
  page: T;
  model: Extract<T, Unit<any>> | Partial<Exclude<T, Unit<any>>>;
}) {
  for (const name in config.page) {
    const pageUnit = config.page[name];
    const modelUnit = config.model[name];

    // Typically we can import page like this:
    // import * as page from './page'
    // And there will be React-component in the list of properties
    // is.unit omit it
    if (pageUnit && modelUnit && is.unit(pageUnit) && is.unit(modelUnit)) {
      // Stores has an unique data flow: from model to page
      // When store in the model is changed, we want to change the store in the page too
      // But we don't want to change store from the page's code
      if (is.store(pageUnit) && is.store(modelUnit)) {
        forward({ from: modelUnit, to: pageUnit });

        pageUnit.defaultState = modelUnit.defaultState;

        // Change current state
        (pageUnit as any).stateRef.current = (modelUnit as any).stateRef.current;

        // Change initial state inside scope
        // https://t.me/c/1489066599/4652
        (pageUnit as any).stateRef.before = [
          {
            type: 'map',
            fn: (state: unknown) => state,
            from: (modelUnit as any).stateRef,
          },
        ];
      }
      // Typical data flow: from page to model
      // When something happened in the page (event is triggered)
      // We want to trigger the same event in the model to start our logic
      // But model can trigger the event too
      // Typically we don't want to subscribe to events in the page
      else {
        forward({ from: pageUnit, to: modelUnit });
      }
    }
  }
}
