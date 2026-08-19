import { type ElementSpec, type Reactivity, read } from "@lattice-ui/core-runtime";
import type { SpinnerCore, SpinnerOptions } from "./types";

const RunService = game.GetService("RunService");

const NEUTRAL: Partial<WritableInstanceProperties<Frame>> = {
  BackgroundTransparency: 1,
  BorderSizePixel: 0,
};

const DEFAULT_SPEED_DEG_PER_SECOND = 180;

/**
 * A continuously rotating indicator.
 *
 * The rotation is a per-frame loop rather than a motion recipe: it never settles, so there is
 * nothing for the motion runtime's target contracts to own.
 */
export function createSpinner(rx: Reactivity, options: SpinnerOptions = {}): SpinnerCore {
  let instance: GuiObject | undefined;
  let connection: RBXScriptConnection | undefined;

  function spinning() {
    return read(options.spinning ?? true) !== false;
  }

  function speed() {
    return read(options.speedDegPerSecond ?? DEFAULT_SPEED_DEG_PER_SECOND) ?? DEFAULT_SPEED_DEG_PER_SECOND;
  }

  return {
    spinning,
    spec: () => ({
      neutral: NEUTRAL,
      props: { Visible: spinning },
    }),
    setInstance: (nextInstance) => {
      instance = nextInstance;
    },
    start: () => {
      if (connection !== undefined) {
        return;
      }

      connection = RunService.Heartbeat.Connect((deltaSeconds) => {
        if (!spinning()) {
          return;
        }

        const spinner = instance;
        if (spinner === undefined) {
          return;
        }

        spinner.Rotation += speed() * deltaSeconds;
      });

      rx.cleanup(() => {
        connection?.Disconnect();
        connection = undefined;
      });
    },
  };
}
