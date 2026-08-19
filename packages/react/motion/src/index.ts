// The core's exports come first; the hooks below intentionally shadow `PresenceMotionControllerOptions`
// with the React-shaped one, so that name is re-exported explicitly rather than by wildcard.

export * from "@lattice-ui/core-motion";
export * from "./core/policy";
export * from "./hooks/useFeedbackEffect";
export type {
  PresenceMotionController,
  PresenceMotionControllerOptions,
} from "./hooks/usePresenceMotion";
export { usePresenceMotion, usePresenceMotionController } from "./hooks/usePresenceMotion";
export * from "./hooks/useResponseMotion";
