import type { AccordionType } from "@lattice-ui/core-accordion";
import type { PresenceMotionConfig } from "@lattice-ui/vide-motion";
import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type { AccordionType };

export type AccordionProps = {
  type?: AccordionType;
  value?: Derivable<string | string[] | undefined>;
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: Derivable<boolean | undefined>;
  /** Written as a function, so items read the accordion context after Root provides it. */
  children?: Vide.Node;
};

export type AccordionItemProps = {
  value: string;
  asChild?: boolean;
  disabled?: Derivable<boolean | undefined>;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type AccordionHeaderProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type AccordionTriggerProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type AccordionContentProps = {
  asChild?: boolean;
  forceMount?: boolean;
  transition?: PresenceMotionConfig;
  children?: Vide.Node;
} & PassthroughProps<Frame>;
