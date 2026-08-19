import type { AccordionCore, AccordionItemCore, AccordionType } from "@lattice-ui/core-accordion";
import type { PresenceMotionConfig } from "@lattice-ui/react-motion";
import type { PassthroughProps } from "@lattice-ui/react-runtime";
import type React from "@rbxts/react";

export type AccordionContextValue = {
  type: AccordionType;
  openValues: Array<string>;
  toggleItem: (value: string) => void;
  /** The core, for the parts that build an item rather than read the open set. */
  core: AccordionCore;
};

export type AccordionItemContextValue = {
  value: string;
  open: boolean;
  disabled: boolean;
  item: AccordionItemCore;
};

export type AccordionProps = {
  type?: AccordionType;
  value?: string | Array<string>;
  defaultValue?: string | Array<string>;
  onValueChange?: (value: string | Array<string>) => void;
  collapsible?: boolean;
  children?: React.ReactNode;
};

export type AccordionItemProps = {
  value: string;
  asChild?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
} & PassthroughProps<Frame>;

export type AccordionHeaderProps = {
  asChild?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<Frame>;

export type AccordionTriggerProps = {
  asChild?: boolean;
  children?: React.ReactElement;
} & PassthroughProps<TextButton>;

export type AccordionContentProps = {
  asChild?: boolean;
  forceMount?: boolean;
  transition?: PresenceMotionConfig;
  children?: React.ReactNode;
} & PassthroughProps<Frame>;
