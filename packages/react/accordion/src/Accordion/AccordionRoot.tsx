import { createAccordion } from "@lattice-ui/core-accordion";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { AccordionContextProvider } from "./context";
import type { AccordionProps } from "./types";

export function AccordionRoot(props: AccordionProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createAccordion(rx, {
      type: propsRef.current.type ?? "single",
      value: () => propsRef.current.value,
      defaultValue: propsRef.current.defaultValue,
      collapsible: () => propsRef.current.collapsible,
      onValueChange: (value) => propsRef.current.onValueChange?.(value),
    }),
  );

  const openValues = core.openValues();

  const contextValue = React.useMemo(
    () => ({ type: core.type(), openValues, toggleItem: core.toggleItem, core }),
    [core, openValues],
  );

  return <AccordionContextProvider value={contextValue}>{props.children}</AccordionContextProvider>;
}

export { AccordionRoot as Accordion };
