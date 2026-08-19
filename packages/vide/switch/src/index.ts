import { SwitchRoot } from "./Switch/SwitchRoot";
import { SwitchThumb } from "./Switch/SwitchThumb";

export const Switch = {
  Root: SwitchRoot,
  Thumb: SwitchThumb,
} as const satisfies {
  Root: typeof SwitchRoot;
  Thumb: typeof SwitchThumb;
};

export { useSwitchContext } from "./Switch/context";
export type { SwitchProps, SwitchThumbProps } from "./Switch/types";
export { SwitchRoot, SwitchThumb };
