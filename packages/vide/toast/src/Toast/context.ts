import type { ToastCore } from "@lattice-ui/core-toast";
import { Vide } from "@lattice-ui/vide-runtime";

export const ToastContext = Vide.context<ToastCore>();

export function useToastContext(): ToastCore {
  const core = ToastContext() as ToastCore | undefined;

  if (core === undefined) {
    error("[Toast] context is undefined. Render this inside <Toast.Provider>.");
  }

  return core;
}

/** The queue API a consumer drives toasts with. */
export function useToast(): ToastCore {
  return useToastContext();
}
