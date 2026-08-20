import { ToastAction } from "./Toast/ToastAction";
import { ToastClose } from "./Toast/ToastClose";
import { ToastDescription } from "./Toast/ToastDescription";
import { ToastProvider } from "./Toast/ToastProvider";
import { ToastRoot } from "./Toast/ToastRoot";
import { ToastTitle } from "./Toast/ToastTitle";
import { ToastViewport } from "./Toast/ToastViewport";

export const Toast = {
  Provider: ToastProvider,
  Viewport: ToastViewport,
  Root: ToastRoot,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
} as const satisfies {
  Provider: typeof ToastProvider;
  Viewport: typeof ToastViewport;
  Root: typeof ToastRoot;
  Title: typeof ToastTitle;
  Description: typeof ToastDescription;
  Action: typeof ToastAction;
  Close: typeof ToastClose;
};

export { useToast, useToastContext } from "./Toast/context";
export type {
  ToastActionProps,
  ToastCloseProps,
  ToastCore,
  ToastDescriptionProps,
  ToastOptions,
  ToastProviderProps,
  ToastRecord,
  ToastRootProps,
  ToastTitleProps,
  ToastViewportProps,
} from "./Toast/types";
export { ToastAction, ToastClose, ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport };
