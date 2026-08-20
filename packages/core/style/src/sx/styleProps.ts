import { omitOwnProps } from "@lattice-ui/core-runtime";
import type { Theme } from "../theme/types";
import { mergeGuiProps } from "./mergeGuiProps";
import { resolveSx, type Sx } from "./sx";

export type StyleProps = Record<string, unknown>;

export interface ResolveStyleOptions {
  /** Props the primitive owns, which never reach the instance. */
  ownKeys: readonly string[];
  /** Defaults the primitive contributes, which consumer props and `sx` may override. */
  base?: StyleProps;
  sx?: Sx<StyleProps>;
  theme: Theme;
}

/**
 * The prop pipeline every styled primitive shares: strip what the primitive owns, resolve `sx`
 * against the theme, and merge in the order the layer guarantees.
 *
 * Where `sx` sits in that order is the primitive's call and is preserved here: `Box` lets `sx` win
 * over passthrough, while `Stack` lets passthrough win over `sx` so a one-off instance prop can
 * still override the layout's own styling.
 */
export function resolveStyleProps(props: object, options: ResolveStyleOptions): StyleProps {
  const rest = omitOwnProps(props, options.ownKeys);

  return mergeGuiProps(options.base ?? {}, rest, resolveSx(options.sx, options.theme));
}

/** As `resolveStyleProps`, but with passthrough applied last so it wins over `sx`. */
export function resolveLayoutStyleProps(props: object, options: ResolveStyleOptions): StyleProps {
  const rest = omitOwnProps(props, options.ownKeys);

  return mergeGuiProps(options.base ?? {}, resolveSx(options.sx, options.theme), rest);
}
