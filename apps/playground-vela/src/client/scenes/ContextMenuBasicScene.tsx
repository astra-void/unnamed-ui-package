import { ContextMenu } from "@lattice-ui/react-context-menu";
import { React } from "@lattice-ui/react-runtime";

const actions = [
  { key: "cut", label: "Cut", intent: "default" as const },
  { key: "copy", label: "Copy", intent: "default" as const },
  { key: "paste", label: "Paste", intent: "default" as const },
  { key: "delete", label: "Delete", intent: "danger" as const },
];

export function ContextMenuBasicScene() {
  const [open, setOpen] = React.useState(false);
  const [selection, setSelection] = React.useState("None");

  return (
    <frame className="w-235 h-140 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(920, 28)}
        Text="Context Menu: right-click a region to open a pointer-anchored menu"
        className="text-ink text-xl text-left"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(920, 24)}
        Text={`Open: ${open ? "true" : "false"} | Selected: ${selection}`}
        className="text-ink-400 text-base text-left"
      />

      <ContextMenu.Root modal={true} onOpenChange={setOpen} open={open}>
        <ContextMenu.Trigger asChild>
          <textbutton
            AutoButtonColor={false}
            Text="Right-click anywhere in this area"
            className="top-19 w-225 h-90 bg-surface text-ink-400 text-base rounded-lg border border-edge"
          />
        </ContextMenu.Trigger>

        <ContextMenu.Portal>
          <ContextMenu.Content asChild placement="bottom">
            <frame className="w-56 h-44 bg-surface rounded-md border border-edge p-2 flex-col gap-1.5">
              <ContextMenu.Label asChild>
                <textlabel Size={UDim2.fromOffset(208, 20)} Text="Edit" className="text-ink-400 text-sm text-left" />
              </ContextMenu.Label>

              <ContextMenu.Group asChild>
                <frame Size={UDim2.fromOffset(208, 128)} className="bg-transparent flex-col gap-1">
                  {/*
                    The `menuItemRecipe` equivalent. The recipe declares the
                    `intent` variant table once and the call site passes
                    `{ intent: action.intent }`; vela has no variant model, and
                    the branch cannot be lifted into a helper component either —
                    `asChild` hands the merged props to its single child, so the
                    child has to stay a host element. That leaves the whole
                    `ContextMenu.Item` duplicated per intent.
                  */}
                  {actions.map((action) =>
                    action.intent === "danger" ? (
                      <ContextMenu.Item
                        key={action.key}
                        asChild
                        onSelect={() => {
                          setSelection(action.label);
                        }}
                      >
                        <textbutton
                          AutoButtonColor={false}
                          Size={UDim2.fromOffset(208, 30)}
                          Text={action.label}
                          className="bg-danger text-danger-50 text-sm text-left pl-2.5"
                        />
                      </ContextMenu.Item>
                    ) : (
                      <ContextMenu.Item
                        key={action.key}
                        asChild
                        onSelect={() => {
                          setSelection(action.label);
                        }}
                      >
                        <textbutton
                          AutoButtonColor={false}
                          Size={UDim2.fromOffset(208, 30)}
                          Text={action.label}
                          className="bg-surface-100 text-ink text-sm text-left pl-2.5"
                        />
                      </ContextMenu.Item>
                    ),
                  )}
                </frame>
              </ContextMenu.Group>
            </frame>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </frame>
  );
}
