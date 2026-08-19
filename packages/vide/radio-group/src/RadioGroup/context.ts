import type { RadioGroupCore, RadioGroupItemCore } from "@lattice-ui/core-radio-group";
import { Vide } from "@lattice-ui/vide-runtime";

export const RadioGroupContext = Vide.context<RadioGroupCore>();
export const RadioGroupItemContext = Vide.context<RadioGroupItemCore>();

export function useRadioGroupContext(): RadioGroupCore {
  const core = RadioGroupContext() as RadioGroupCore | undefined;

  if (core === undefined) {
    error("[RadioGroup] context is undefined. Render this inside <RadioGroup.Root>.");
  }

  return core;
}

export function useRadioGroupItemContext(): RadioGroupItemCore {
  const item = RadioGroupItemContext() as RadioGroupItemCore | undefined;

  if (item === undefined) {
    error("[RadioGroup] item context is undefined. Render this inside <RadioGroup.Item>.");
  }

  return item;
}
