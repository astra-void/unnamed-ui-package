import { DialogClose } from "./Dialog/DialogClose";
import { DialogContent } from "./Dialog/DialogContent";
import { DialogOverlay } from "./Dialog/DialogOverlay";
import { DialogPortal } from "./Dialog/DialogPortal";
import { DialogRoot } from "./Dialog/DialogRoot";
import { DialogTrigger } from "./Dialog/DialogTrigger";

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Close: DialogClose,
} as const satisfies {
  Root: typeof DialogRoot;
  Trigger: typeof DialogTrigger;
  Portal: typeof DialogPortal;
  Overlay: typeof DialogOverlay;
  Content: typeof DialogContent;
  Close: typeof DialogClose;
};

export { useDialogContext } from "./Dialog/context";
export type {
  DialogCloseProps,
  DialogContentProps,
  DialogOverlayProps,
  DialogPortalProps,
  DialogProps,
  DialogTriggerProps,
} from "./Dialog/types";
export { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTrigger };
