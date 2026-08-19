import { GuiService } from "@rbxts/services";
import type { MotionPolicy } from "./types";

export interface MotionPolicyPreferences {
  mode?: MotionPolicy["mode"];
  disableAllMotion?: boolean;
  respectSystemReducedMotion?: boolean;
}

/** Whether the player has asked the system to reduce motion. */
export function readSystemReducedMotion(): boolean {
  const [ok, value] = pcall(() => GuiService.ReducedMotionEnabled);
  return ok && value === true;
}

/** Watches the system setting. Returns a disconnect function. */
export function subscribeSystemReducedMotion(onChange: (reduced: boolean) => void): () => void {
  let connection: RBXScriptConnection | undefined;

  pcall(() => {
    connection = GuiService.GetPropertyChangedSignal("ReducedMotionEnabled").Connect(() => {
      onChange(readSystemReducedMotion());
    });
  });

  return () => {
    connection?.Disconnect();
  };
}

/**
 * Folds a consumer's preferences and the system setting into the policy the runtime honours.
 *
 * Kept apart from any provider so both layers reach the same answer: what a framework contributes is
 * how the preferences travel down the tree, not what they mean.
 */
export function resolveMotionPolicy(preferences: MotionPolicyPreferences, systemReducedMotion: boolean): MotionPolicy {
  const requestedMode = preferences.disableAllMotion === true ? "none" : (preferences.mode ?? "full");
  const respectSystem = preferences.respectSystemReducedMotion ?? true;
  const disableAllMotion = requestedMode === "none" || (respectSystem && systemReducedMotion);

  return {
    mode: disableAllMotion ? "none" : requestedMode,
    disableAllMotion,
  };
}
