import type Vide from "@rbxts/vide";
import type { PassthroughProps } from "./props";
import VideRuntime from "./vide";

/**
 * Resolves what a consumer passed as `children` down to the single instance an `asChild` primitive
 * should render into.
 *
 * Vide children are frequently functions — a component that reads context has to be one, because
 * context is only readable while the providing component runs — so a function node is called here
 * rather than rejected.
 */
export function resolveSlotInstance(children: Vide.Node): Instance | undefined {
  let node: unknown = children;

  if (typeIs(node, "function")) {
    node = (node as () => unknown)();
  }

  return typeIs(node, "Instance") ? (node as Instance) : undefined;
}

/**
 * Applies a primitive's props onto an instance the consumer owns.
 *
 * This is the Vide answer to React's `Slot`, and a much smaller one: React has to clone an element
 * and merge two prop bags before anything is instantiated, while Vide hands the primitive a real
 * instance whose own props are already applied — so the primitive's props are simply applied on
 * top, and an event prop applied twice connects both handlers rather than replacing one.
 */
export function applySlotProps<T extends Instance>(instance: T, props: PassthroughProps<T>): T {
  return VideRuntime.apply(instance)(props as never);
}
