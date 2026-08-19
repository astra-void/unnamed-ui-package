import { type Derivable, read } from "@lattice-ui/core-runtime";
import type { TooltipDelayPolicy, TooltipProviderOptions } from "./types";

const DEFAULT_DELAY_MS = 700;
const DEFAULT_SKIP_DELAY_MS = 300;

/**
 * The delay policy a group of tooltips shares.
 *
 * Moving between triggers should not make the player wait the full delay each time, so a tooltip
 * that opens shortly after another closed opens on the shorter skip delay instead.
 */
export function createTooltipPolicy(options: TooltipProviderOptions = {}): TooltipDelayPolicy {
  let lastOpenTimestamp: number | undefined;

  function delayDuration() {
    return read(options.delayDuration ?? DEFAULT_DELAY_MS) ?? DEFAULT_DELAY_MS;
  }

  function skipDelayDuration() {
    return read(options.skipDelayDuration ?? DEFAULT_SKIP_DELAY_MS) ?? DEFAULT_SKIP_DELAY_MS;
  }

  return {
    markOpen: () => {
      lastOpenTimestamp = os.clock();
    },
    resolveOpenDelay: (requestedDelay?: number) => {
      const baseDelay = requestedDelay ?? delayDuration();
      if (lastOpenTimestamp === undefined) {
        return baseDelay;
      }

      const elapsedMs = (os.clock() - lastOpenTimestamp) * 1000;
      if (elapsedMs <= skipDelayDuration()) {
        return math.min(baseDelay, skipDelayDuration());
      }

      return baseDelay;
    },
  };
}

/** The policy a tooltip uses when it is not inside a provider. */
export function createDefaultTooltipPolicy(): TooltipDelayPolicy {
  return {
    resolveOpenDelay: (requestedDelay?: number) => requestedDelay ?? DEFAULT_DELAY_MS,
    markOpen: () => {},
  };
}

export type { Derivable };
