import { Menu } from "@lattice-ui/react-menu";
import { React } from "@lattice-ui/react-runtime";

const actions = [
  { key: "open", label: "Open File", intent: "default" as const },
  { key: "duplicate", label: "Duplicate", intent: "default" as const },
  { key: "archive", label: "Archive", intent: "default" as const },
  { key: "delete", label: "Delete", intent: "danger" as const },
];

export function MenuBasicScene() {
  const [open, setOpen] = React.useState(false);
  const [selection, setSelection] = React.useState("None");

  return (
    <frame className="w-235 h-140 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(920, 28)}
        Text="Menu: grouped items, keyboard navigation, and selection dismissal"
        className="text-ink text-xl text-left"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(920, 24)}
        Text={`Open: ${open ? "true" : "false"} | Selected: ${selection}`}
        className="text-ink-400 text-base text-left"
      />

      <frame className="top-19 w-225 h-75 bg-surface rounded-lg p-3 flex-col gap-3">
        <Menu.Root modal={false} onOpenChange={setOpen} open={open}>
          <Menu.Trigger asChild>
            <textbutton
              AutoButtonColor={false}
              Size={UDim2.fromOffset(200, 42)}
              Text={open ? "Menu Open" : "Open Menu"}
              className="bg-accent text-accent-50 text-base"
            />
          </Menu.Trigger>

          <textlabel
            Size={UDim2.fromOffset(860, 22)}
            Text="Arrow keys move through items. Enter or click selects and closes the menu."
            className="text-ink-400 text-sm text-left"
          />

          <Menu.Portal>
            <Menu.Content asChild sideOffset={8} placement="bottom">
              <frame className="w-60 h-52 bg-surface rounded-md border border-edge p-2 flex-col gap-1.5">
                <Menu.Label asChild>
                  <textlabel
                    Size={UDim2.fromOffset(224, 20)}
                    Text="Actions"
                    className="text-ink-400 text-sm text-left"
                  />
                </Menu.Label>

                <Menu.Group asChild>
                  <frame Size={UDim2.fromOffset(224, 128)} className="bg-transparent flex-col gap-1">
                    {/* One `Menu.Item` per intent — see ContextMenuBasicScene for why. */}
                    {actions.map((action) =>
                      action.intent === "danger" ? (
                        <Menu.Item
                          key={action.key}
                          asChild
                          onSelect={() => {
                            setSelection(action.label);
                          }}
                        >
                          <textbutton
                            AutoButtonColor={false}
                            Size={UDim2.fromOffset(224, 30)}
                            Text={action.label}
                            className="bg-danger text-danger-50 text-sm text-left pl-2.5"
                          />
                        </Menu.Item>
                      ) : (
                        <Menu.Item
                          key={action.key}
                          asChild
                          onSelect={() => {
                            setSelection(action.label);
                          }}
                        >
                          <textbutton
                            AutoButtonColor={false}
                            Size={UDim2.fromOffset(224, 30)}
                            Text={action.label}
                            className="bg-surface-100 text-ink text-sm text-left pl-2.5"
                          />
                        </Menu.Item>
                      ),
                    )}
                  </frame>
                </Menu.Group>

                <Menu.Separator asChild>
                  <frame Size={UDim2.fromOffset(224, 1)} className="bg-edge" />
                </Menu.Separator>

                <Menu.Item
                  asChild
                  disabled={true}
                  onSelect={() => {
                    setSelection("Settings (disabled)");
                  }}
                >
                  {/* `Active`/`Selectable` have no utility, so the disabled recipe's
                      behavioral half stays in props while its palette moves to classes. */}
                  <textbutton
                    Active={false}
                    AutoButtonColor={false}
                    Selectable={false}
                    Size={UDim2.fromOffset(224, 30)}
                    Text="Settings (Disabled)"
                    className="bg-surface text-ink-400 text-sm text-left pl-2.5"
                  />
                </Menu.Item>
              </frame>
            </Menu.Content>
          </Menu.Portal>
        </Menu.Root>
      </frame>
    </frame>
  );
}
