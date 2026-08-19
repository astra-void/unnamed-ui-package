import { type Derivable, type Reactivity, read } from "@lattice-ui/core-runtime";
import {
  createFocusScopeId,
  type NavOrientation,
  type NavStrategy,
  registerFocusScope,
  releaseNavigation,
  retainNavigation,
  syncFocusScope,
  unregisterFocusScope,
} from "./focusManager";

export interface FocusScopeOptions {
  parentScopeId?: number;
  active?: Derivable<boolean | undefined>;
  trapped?: Derivable<boolean | undefined>;
  restoreFocus?: Derivable<boolean | undefined>;
  layerOrder?: Derivable<number | undefined>;
  navStrategy?: Derivable<NavStrategy | undefined>;
  navOrientation?: Derivable<NavOrientation | undefined>;
  navWrap?: Derivable<boolean | undefined>;
}

export interface FocusScopeCore {
  scopeId: number;
  /** The instance the scope covers. Adapters hand it over from a ref or an action. */
  setRoot: (instance: Instance | undefined) => void;
  /** Registers with the focus manager. Idempotent; unregisters through the cleanup. */
  start: () => void;
  /**
   * Re-reads the scope's inputs.
   *
   * The manager pulls most of them through getters, so this exists for the one that is
   * edge-triggered: navigation is retained while the scope is active and released when it is not.
   */
  sync: () => void;
}

function toGuiObject(instance: Instance | undefined) {
  if (instance?.IsA("GuiObject") !== true) {
    return undefined;
  }

  return instance;
}

/**
 * A focus scope's registration, free of any UI framework.
 *
 * The focus manager itself was already framework-free; what lived in the React component was the
 * lifecycle around it — when to register, what the scope's current settings are, and holding the
 * navigation binds open for as long as some scope is active.
 */
export function createFocusScope(rx: Reactivity, options: FocusScopeOptions = {}): FocusScopeCore {
  const scopeId = createFocusScopeId();

  let root: GuiObject | undefined;
  let started = false;
  let retained = false;

  function isActive() {
    return read(options.active ?? true) !== false;
  }

  function syncNavigationRetention() {
    const active = isActive();

    if (active && !retained) {
      retained = true;
      retainNavigation();
      return;
    }

    if (!active && retained) {
      retained = false;
      releaseNavigation();
    }
  }

  function sync() {
    if (!started) {
      return;
    }

    syncFocusScope(scopeId);
    syncNavigationRetention();
  }

  return {
    scopeId,
    setRoot: (instance) => {
      root = toGuiObject(instance);

      if (started) {
        syncFocusScope(scopeId);
      }
    },
    start: () => {
      if (started) {
        return;
      }

      started = true;
      registerFocusScope(scopeId, {
        parentScopeId: options.parentScopeId,
        getRoot: () => root,
        getActive: isActive,
        getTrapped: () => read(options.trapped ?? false) === true,
        getRestoreFocus: () => read(options.restoreFocus ?? true) !== false,
        getLayerOrder: () => read(options.layerOrder ?? undefined),
        getNavStrategy: () => read(options.navStrategy ?? "spatial") ?? "spatial",
        getNavOrientation: () => read(options.navOrientation ?? "vertical") ?? "vertical",
        getNavWrap: () => read(options.navWrap ?? false) === true,
      });

      syncNavigationRetention();

      rx.cleanup(() => {
        if (retained) {
          retained = false;
          releaseNavigation();
        }

        unregisterFocusScope(scopeId);
        started = false;
      });
    },
    sync,
  };
}
