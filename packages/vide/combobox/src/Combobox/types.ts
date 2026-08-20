import type { ComboboxFilterFn } from "@lattice-ui/core-combobox";
import type { PopperPlacement } from "@lattice-ui/core-popper";
import type { PresenceMotionConfig } from "@lattice-ui/vide-motion";
import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type ComboboxProps = {
  inputValue?: Derivable<string | undefined>;
  defaultInputValue?: string;
  onInputValueChange?: (inputValue: string) => void;
  readOnly?: Derivable<boolean | undefined>;
  filterFn?: Derivable<ComboboxFilterFn | undefined>;
  value?: Derivable<string | undefined>;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  disabled?: Derivable<boolean | undefined>;
  required?: Derivable<boolean | undefined>;
  open?: Derivable<boolean | undefined>;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: Derivable<boolean | undefined>;
  /** Written as a function, so the parts read the menu context after Root provides it. */
  children?: Vide.Node;
};

export type ComboboxTriggerProps = {
  asChild?: boolean;
  disabled?: Derivable<boolean | undefined>;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type ComboboxPortalProps = {
  container?: BasePlayerGui;
  displayOrderBase?: number;
  children?: Vide.Node;
};

export type ComboboxContentProps = {
  transition?: PresenceMotionConfig;
  asChild?: boolean;
  forceMount?: boolean;
  placement?: Derivable<PopperPlacement | undefined>;
  sideOffset?: Derivable<number | undefined>;
  alignOffset?: Derivable<number | undefined>;
  collisionPadding?: Derivable<number | undefined>;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type ComboboxItemProps = {
  value: string;
  /** The text `Combobox.Value` shows for this item. Defaults to `value`. */
  textValue?: string;
  asChild?: boolean;
  disabled?: Derivable<boolean | undefined>;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type ComboboxGroupProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type ComboboxSeparatorProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type ComboboxLabelProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextLabel>;

export type ComboboxValueProps = {
  asChild?: boolean;
  placeholder?: string;
  children?: Vide.Node;
} & PassthroughProps<TextLabel>;

export type ComboboxInputProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextBox>;
