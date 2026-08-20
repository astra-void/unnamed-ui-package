import {
  type MotionPolicy,
  readSystemReducedMotion,
  resolveMotionPolicy,
  subscribeSystemReducedMotion,
} from "@lattice-ui/core-motion";
import { type Derivable, read, Vide } from "@lattice-ui/vide-runtime";
import type VideTypes from "@rbxts/vide";

/**
 * The preferences are carried as derivables, not as the plain values `MotionPolicyPreferences`
 * holds. A Vide component runs once, so a context value read at that moment would fix the motion
 * policy for the lifetime of the tree, where the React layer re-reads it on every render.
 */
export interface VideMotionPreferences {
  mode?: Derivable<MotionPolicy["mode"] | undefined>;
  disableAllMotion?: Derivable<boolean | undefined>;
  respectSystemReducedMotion?: Derivable<boolean | undefined>;
}

export const MotionContext = Vide.context<VideMotionPreferences>();

export type MotionProviderProps = VideMotionPreferences & {
  children: () => VideTypes.Node;
};

export function MotionProvider(props: MotionProviderProps) {
  return MotionContext(
    {
      mode: props.mode,
      disableAllMotion: props.disableAllMotion,
      respectSystemReducedMotion: props.respectSystemReducedMotion,
    },
    props.children,
  );
}

/**
 * The motion policy as a getter, since the system's reduced-motion setting can change while the UI
 * is up. Read the context at the top level of a component, as always in Vide.
 */
export function useMotionPolicy(): () => MotionPolicy {
  const preferences = (MotionContext() as VideMotionPreferences | undefined) ?? {};
  const systemReducedMotion = Vide.source(readSystemReducedMotion());

  Vide.cleanup(
    subscribeSystemReducedMotion((reduced) => {
      systemReducedMotion(reduced);
    }),
  );

  return () =>
    resolveMotionPolicy(
      {
        mode: read(preferences.mode),
        disableAllMotion: read(preferences.disableAllMotion),
        respectSystemReducedMotion: read(preferences.respectSystemReducedMotion),
      },
      systemReducedMotion(),
    );
}
