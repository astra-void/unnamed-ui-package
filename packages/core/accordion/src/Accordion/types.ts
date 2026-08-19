import type { Derivable, ElementSpec } from "@lattice-ui/core-runtime";
import type { AccordionType } from "./state";

export type { AccordionType };

export interface AccordionOptions {
  type?: AccordionType;
  value?: Derivable<string | string[] | undefined>;
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /** Whether the open section in `single` mode can be closed by activating it again. */
  collapsible?: Derivable<boolean | undefined>;
}

export interface AccordionItemOptions {
  value: string;
  disabled?: Derivable<boolean | undefined>;
}

export interface AccordionItemCore {
  value: string;
  open: () => boolean;
  disabled: () => boolean;
  itemSpec: () => ElementSpec<Frame>;
  headerSpec: () => ElementSpec<Frame>;
  triggerSpec: () => ElementSpec<TextButton>;
  contentSpec: () => ElementSpec<Frame>;
}

export interface AccordionCore {
  type: () => AccordionType;
  openValues: () => string[];
  toggleItem: (value: string) => void;
  isOpen: (value: string) => boolean;
  createItem: (options: AccordionItemOptions) => AccordionItemCore;
}
