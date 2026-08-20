import type { ComboboxCore } from "@lattice-ui/core-combobox";
import type { LayerInteractEvent } from "@lattice-ui/react-layer";
import type { PresenceMotionConfig as MotionConfig } from "@lattice-ui/react-motion";
import type { PopperPlacement } from "@lattice-ui/react-popper";
import type { PassthroughProps } from "@lattice-ui/react-runtime";
import type React from "@rbxts/react";

export type ComboboxFilterFn = (itemText: string, query: string) => boolean;

export type ComboboxSetOpen = (open: boolean) => void;
export type ComboboxSetValue = (value: string) => void;
export type ComboboxSetInputValue = (inputValue: string) => void;

export type ComboboxContextValue = {
  open: boolean;
  setOpen: ComboboxSetOpen;
  value?: string;
  setValue: ComboboxSetValue;
  inputValue: string;
  queryValue: string;
  setInputValue: ComboboxSetInputValue;
  syncInputFromValue: () => void;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  filterFn: ComboboxFilterFn;
  getItemText: (value: string) => string | undefined;
  /** The core, for the parts that build an item or position against the instances. */
  core: ComboboxCore;
};

/** Per-item state consumers read to style the item; the primitive never paints it. */
export type ComboboxItemContextValue = {
  highlighted: boolean;
  disabled: boolean;
};

// `Combobox` renders no instance of its own (it is a context provider), so it takes no passthrough
// props. Every part below renders an instance and forwards unknown props onto it.
export type ComboboxProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (inputValue: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  filterFn?: ComboboxFilterFn;
  children?: React.ReactNode;
};

export type ComboboxTriggerProps = {
  asChild?: boolean;
  disabled?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<TextButton>;

export type ComboboxInputProps = {
  asChild?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  children?: React.ReactElement;
} & PassthroughProps<TextBox>;

export type ComboboxValueProps = {
  asChild?: boolean;
  placeholder?: string;
  children?: React.ReactElement;
} & PassthroughProps<TextLabel>;

export type ComboboxPortalProps = {
  container?: BasePlayerGui;
  displayOrderBase?: number;
  children?: React.ReactNode;
};

export type ComboboxContentProps = {
  transition?: MotionConfig;
  asChild?: boolean;
  forceMount?: boolean;
  placement?: PopperPlacement;
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number;
  onPointerDownOutside?: (event: LayerInteractEvent) => void;
  onInteractOutside?: (event: LayerInteractEvent) => void;
  children?: React.ReactNode;
} & PassthroughProps<Frame>;

export type ComboboxItemProps = {
  value: string;
  textValue?: string;
  disabled?: boolean;
  asChild?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<TextButton>;

export type ComboboxSeparatorProps = {
  asChild?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<Frame>;

export type ComboboxGroupProps = {
  asChild?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<Frame>;

export type ComboboxLabelProps = {
  asChild?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<TextLabel>;
