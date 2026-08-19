import { AvatarFallback } from "./Avatar/AvatarFallback";
import { AvatarImage } from "./Avatar/AvatarImage";
import { AvatarRoot } from "./Avatar/AvatarRoot";

export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
} as const satisfies {
  Root: typeof AvatarRoot;
  Image: typeof AvatarImage;
  Fallback: typeof AvatarFallback;
};

export { useAvatarContext } from "./Avatar/context";
export type { AvatarFallbackProps, AvatarImageProps, AvatarProps } from "./Avatar/types";
export { AvatarFallback, AvatarImage, AvatarRoot };
