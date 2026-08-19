import { createStandaloneReactivity, type Reactivity, type StandaloneReactivity } from "@lattice-ui/core-runtime";
import React from "@rbxts/react";

/**
 * Reactivity for the React layer.
 *
 * Core state lives outside React, so React only learns about a change when something schedules a
 * render — that is what `notify` is for. Reads stay plain getter calls during render.
 */
export function createReactReactivity(notify: () => void): StandaloneReactivity {
  return createStandaloneReactivity({ onChange: notify });
}

/**
 * Builds a behavior core once and keeps it for the component's lifetime.
 *
 * A core is a plain factory rather than a hook because a Vide component body runs once and cannot
 * re-create it; React honours the same contract by constructing it inside a ref. Cores are pure to
 * construct, so running the factory during render schedules nothing.
 */
export function useLatticeCore<T>(create: (rx: Reactivity) => T): T {
  const [, setVersion] = React.useState(0);
  const holder = React.useRef<{ core: T; rx: StandaloneReactivity }>();

  if (holder.current === undefined) {
    const rx = createReactReactivity(() => {
      setVersion((version) => version + 1);
    });

    holder.current = { core: create(rx), rx };
  }

  React.useEffect(() => {
    return () => {
      holder.current?.rx.dispose();
    };
  }, []);

  return holder.current.core;
}
