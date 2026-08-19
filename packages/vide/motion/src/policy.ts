import {
  type MotionPolicy,
  type MotionPolicyPreferences,
  readSystemReducedMotion,
  resolveMotionPolicy,
  subscribeSystemReducedMotion,
} from "@lattice-ui/core-motion";
import { Vide } from "@lattice-ui/vide-runtime";
import type VideTypes from "@rbxts/vide";

export const MotionContext = Vide.context<MotionPolicyPreferences>();

export function MotionProvider(props: {
  mode?: MotionPolicy["mode"];
  disableAllMotion?: boolean;
  respectSystemReducedMotion?: boolean;
  children: () => VideTypes.Node;
}) {
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
  const preferences = (MotionContext() as MotionPolicyPreferences | undefined) ?? {};
  const systemReducedMotion = Vide.source(readSystemReducedMotion());

  Vide.cleanup(
    subscribeSystemReducedMotion((reduced) => {
      systemReducedMotion(reduced);
    }),
  );

  return () => resolveMotionPolicy(preferences, systemReducedMotion());
}
