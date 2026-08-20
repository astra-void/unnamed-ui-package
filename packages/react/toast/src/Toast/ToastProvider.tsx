import { createToast } from "@lattice-ui/core-toast";
import { React, useLatticeCore } from "@lattice-ui/react-runtime";
import { ToastContextProvider, useToastContext } from "./context";
import type { ToastApi, ToastProviderProps } from "./types";

export function ToastProvider(props: ToastProviderProps) {
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const core = useLatticeCore((rx) =>
    createToast(rx, {
      defaultDurationMs: () => propsRef.current.defaultDurationMs,
      maxVisible: () => propsRef.current.maxVisible,
    }),
  );

  React.useEffect(() => {
    core.start();
  }, [core]);

  const toasts = core.toasts();
  const visibleToasts = core.visibleToasts();
  const defaultDurationMs = core.defaultDurationMs();
  const maxVisible = core.maxVisible();

  const contextValue = React.useMemo(
    () => ({
      toasts,
      visibleToasts,
      defaultDurationMs,
      maxVisible,
      enqueue: core.enqueue,
      remove: core.remove,
      finalize: core.finalize,
      clear: core.clear,
      core,
    }),
    [core, defaultDurationMs, maxVisible, toasts, visibleToasts],
  );

  return <ToastContextProvider value={contextValue}>{props.children}</ToastContextProvider>;
}

export function useToast(): ToastApi {
  const toastContext = useToastContext();
  return {
    toasts: toastContext.toasts,
    visibleToasts: toastContext.visibleToasts,
    enqueue: toastContext.enqueue,
    remove: toastContext.remove,
    finalize: toastContext.finalize,
    clear: toastContext.clear,
  };
}
