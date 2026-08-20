import { ComboboxContent } from "./Combobox/ComboboxContent";
import { ComboboxGroup } from "./Combobox/ComboboxGroup";
import { ComboboxInput } from "./Combobox/ComboboxInput";
import { ComboboxItem } from "./Combobox/ComboboxItem";
import { ComboboxLabel } from "./Combobox/ComboboxLabel";
import { ComboboxPortal } from "./Combobox/ComboboxPortal";
import { ComboboxRoot } from "./Combobox/ComboboxRoot";
import { ComboboxSeparator } from "./Combobox/ComboboxSeparator";
import { ComboboxTrigger } from "./Combobox/ComboboxTrigger";
import { ComboboxValue } from "./Combobox/ComboboxValue";

export const Combobox = {
  Root: ComboboxRoot,
  Trigger: ComboboxTrigger,
  Input: ComboboxInput,
  Value: ComboboxValue,
  Portal: ComboboxPortal,
  Content: ComboboxContent,
  Item: ComboboxItem,
  Group: ComboboxGroup,
  Label: ComboboxLabel,
  Separator: ComboboxSeparator,
} as const satisfies {
  Root: typeof ComboboxRoot;
  Trigger: typeof ComboboxTrigger;
  Input: typeof ComboboxInput;
  Value: typeof ComboboxValue;
  Portal: typeof ComboboxPortal;
  Content: typeof ComboboxContent;
  Item: typeof ComboboxItem;
  Group: typeof ComboboxGroup;
  Label: typeof ComboboxLabel;
  Separator: typeof ComboboxSeparator;
};

// The Vide layer has no `vide-popper` package — the popper is behavior, and behavior lives in the
// core — so the placement type is re-exported here, where the prop that takes it is declared.
export type { PopperPlacement } from "@lattice-ui/core-popper";
export { useComboboxContext, useComboboxItemContext } from "./Combobox/context";
export type {
  ComboboxContentProps,
  ComboboxGroupProps,
  ComboboxInputProps,
  ComboboxItemProps,
  ComboboxLabelProps,
  ComboboxPortalProps,
  ComboboxProps,
  ComboboxSeparatorProps,
  ComboboxTriggerProps,
  ComboboxValueProps,
} from "./Combobox/types";
export {
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
};
