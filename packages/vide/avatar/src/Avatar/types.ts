import type { Derivable, PassthroughProps } from "@lattice-ui/vide-runtime";
import type Vide from "@rbxts/vide";

export type AvatarProps = {
  src?: Derivable<string | undefined>;
  delayMs?: Derivable<number | undefined>;
  /** Written as a function, so the image and fallback read the context after Root provides it. */
  children?: Vide.Node;
};

export type AvatarImageProps = {
  asChild?: boolean;
  src?: Derivable<string | undefined>;
  children?: Vide.Node;
} & PassthroughProps<ImageLabel>;

export type AvatarFallbackProps = {
  asChild?: boolean;
  children?: Vide.Node;
} & PassthroughProps<TextLabel>;
