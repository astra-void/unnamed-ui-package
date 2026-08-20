import { createToast } from "@lattice-ui/core-toast";
import { createVideReactivity, renderChildren } from "@lattice-ui/vide-runtime";
import { ToastContext } from "./context";
import type { ToastProviderProps } from "./types";

export function ToastProvider(props: ToastProviderProps) {
  const core = createToast(createVideReactivity(), {
    defaultDurationMs: props.defaultDurationMs,
    maxVisible: props.maxVisible,
  });

  core.start();

  return ToastContext(core, () => renderChildren(props.children));
}
