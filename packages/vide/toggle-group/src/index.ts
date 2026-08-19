import { ToggleGroupItem } from "./ToggleGroup/ToggleGroupItem";
import { ToggleGroupRoot } from "./ToggleGroup/ToggleGroupRoot";

export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem,
} as const satisfies {
  Root: typeof ToggleGroupRoot;
  Item: typeof ToggleGroupItem;
};

export { useToggleGroupContext } from "./ToggleGroup/context";
export type { ToggleGroupItemProps, ToggleGroupProps, ToggleGroupType } from "./ToggleGroup/types";
export { ToggleGroupItem, ToggleGroupRoot };
