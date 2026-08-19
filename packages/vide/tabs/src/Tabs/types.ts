import type { TabsOrientation } from "@lattice-ui/core-tabs";
import type { PresenceMotionConfig } from "@lattice-ui/vide-motion";
import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type { TabsOrientation };

export type TabsProps = {
  value?: Derivable<string | undefined>;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: Derivable<TabsOrientation | undefined>;
  /** Written as a function, so the parts read the tabs context after Root provides it. */
  children?: Vide.Node;
};

export type TabsListProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;

export type TabsTriggerProps = {
  value: string;
  asChild?: boolean;
  disabled?: Derivable<boolean | undefined>;
  children?: Vide.Node;
} & PassthroughProps<TextButton>;

export type TabsContentProps = {
  transition?: PresenceMotionConfig;
  value: string;
  asChild?: boolean;
  forceMount?: boolean;
  children?: Vide.Node;
} & PassthroughProps<Frame>;
