import { RadioGroupIndicator } from "./RadioGroup/RadioGroupIndicator";
import { RadioGroupItem } from "./RadioGroup/RadioGroupItem";
import { RadioGroupRoot } from "./RadioGroup/RadioGroupRoot";

export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
} as const satisfies {
  Root: typeof RadioGroupRoot;
  Item: typeof RadioGroupItem;
  Indicator: typeof RadioGroupIndicator;
};

export { useRadioGroupContext, useRadioGroupItemContext } from "./RadioGroup/context";
export type { RadioGroupIndicatorProps, RadioGroupItemProps, RadioGroupProps } from "./RadioGroup/types";
export { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot };
