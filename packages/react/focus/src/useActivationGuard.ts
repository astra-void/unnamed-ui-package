import { type ActivationGuard, createActivationGuard } from "@lattice-ui/core-focus";
import { React } from "@lattice-ui/react-runtime";

export type { ActivationGuard };

/** React binding for the activation guard. See `createActivationGuard` for what it dedupes. */
export function useActivationGuard(): ActivationGuard {
  const guardRef = React.useRef<ActivationGuard>();

  if (guardRef.current === undefined) {
    guardRef.current = createActivationGuard();
  }

  return guardRef.current;
}
