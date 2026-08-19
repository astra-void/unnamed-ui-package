import { ProgressIndicator } from "./Progress/ProgressIndicator";
import { ProgressRoot } from "./Progress/ProgressRoot";
import { Spinner } from "./Progress/Spinner";

export const Progress = {
  Root: ProgressRoot,
  Indicator: ProgressIndicator,
  Spinner,
} as const satisfies {
  Root: typeof ProgressRoot;
  Indicator: typeof ProgressIndicator;
  Spinner: typeof Spinner;
};

export { useProgressContext } from "./Progress/context";
export type { ProgressIndicatorProps, ProgressProps, SpinnerProps } from "./Progress/types";
export { ProgressIndicator, ProgressRoot, Spinner };
