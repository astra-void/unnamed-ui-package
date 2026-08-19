import { createFocusScope, type NavOrientation, type NavStrategy } from "@lattice-ui/core-focus";
import {
  applySlotProps,
  createVideReactivity,
  type Derivable,
  read,
  resolveSlotInstance,
  Vide,
} from "@lattice-ui/vide-runtime";
import type VideTypes from "@rbxts/vide";
import { FocusScopeIdContext, useFocusLayerOrder, useFocusScopeId } from "./context";

export type FocusScopeProps = {
  active?: Derivable<boolean | undefined>;
  asChild?: boolean;
  trapped?: Derivable<boolean | undefined>;
  restoreFocus?: Derivable<boolean | undefined>;
  // How directional navigation resolves between nodes inside this scope. Defaults to "spatial".
  // Ordered scopes (menus, tab lists) step by order along `navOrientation` and escape cross-axis
  // moves to the parent scope.
  navStrategy?: Derivable<NavStrategy | undefined>;
  navOrientation?: Derivable<NavOrientation | undefined>;
  navWrap?: Derivable<boolean | undefined>;
  children?: VideTypes.Node;
};

export function FocusScope(props: FocusScopeProps) {
  const parentScopeId = useFocusScopeId();
  const layerOrder = useFocusLayerOrder();
  const rx = createVideReactivity();

  const core = createFocusScope(rx, {
    parentScopeId,
    active: props.active,
    trapped: props.trapped,
    restoreFocus: props.restoreFocus,
    layerOrder,
    navStrategy: props.navStrategy,
    navOrientation: props.navOrientation,
    navWrap: props.navWrap,
  });

  core.start();

  // Read the settings tracked so a source among them re-syncs the scope, but keep `sync` itself
  // untracked: it reaches into the focus manager, and what that reads is none of this effect's
  // business.
  rx.effect(() => {
    read(props.active ?? true);
    read(props.trapped ?? false);
    read(props.restoreFocus ?? true);
    read(props.navStrategy ?? "spatial");
    read(props.navOrientation ?? "vertical");
    read(props.navWrap ?? false);
    layerOrder();

    Vide.untrack(() => {
      core.sync();
    });
  });

  return FocusScopeIdContext(core.scopeId, () => {
    if (props.asChild === true) {
      const child = resolveSlotInstance(props.children);
      if (child === undefined) {
        error("[FocusScope] `asChild` requires a child instance.");
      }

      core.setRoot(child);
      return applySlotProps(child as GuiObject, {});
    }

    return (
      <frame
        action={(instance: Frame) => core.setRoot(instance)}
        BackgroundTransparency={1}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0, 0)}
        Size={UDim2.fromScale(1, 1)}
      >
        {props.children}
      </frame>
    );
  });
}
