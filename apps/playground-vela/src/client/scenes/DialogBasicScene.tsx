import { Dialog } from "@lattice-ui/react-dialog";
import { React } from "@lattice-ui/react-runtime";

export function DialogBasicScene() {
  const [basicOpen, setBasicOpen] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [lastAction, setLastAction] = React.useState("none");

  const openStates = `basic=${basicOpen ? "true" : "false"}  form=${formOpen ? "true" : "false"}  confirm=${confirmOpen ? "true" : "false"}`;

  return (
    <frame className="w-230 h-130 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(820, 28)}
        Text="Trigger opens a dialog. Outside click and Close button dismiss."
        className="text-ink text-xl text-left"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(560, 22)}
        Text={`Open: ${openStates}`}
        className="text-ink-400 text-base text-left"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 56)}
        Size={UDim2.fromOffset(560, 22)}
        Text={`Last confirm action: ${lastAction}`}
        className="text-ink-400 text-sm text-left"
      />

      <textlabel
        Position={UDim2.fromOffset(0, 92)}
        Size={UDim2.fromOffset(400, 20)}
        Text="Variants"
        className="text-ink-400 text-sm text-left"
      />

      {/* Basic dialog */}
      <Dialog.Root modal={false} onOpenChange={setBasicOpen} open={basicOpen}>
        <Dialog.Trigger asChild>
          <textbutton
            AutoButtonColor={false}
            Text={basicOpen ? "Basic Opened" : "Open Basic"}
            className="top-29.5 w-42.5 h-10.5 bg-accent text-accent-50 text-base"
          />
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Content>
            <frame
              AnchorPoint={new Vector2(0.5, 0.5)}
              Position={UDim2.fromScale(0.5, 0.5)}
              className="w-105 h-52.5 z-10 bg-surface-100 rounded-lg border border-edge p-4"
            >
              <textlabel
                Size={UDim2.fromOffset(388, 30)}
                Text="Dialog Basic"
                ZIndex={11}
                className="text-ink text-xl text-left"
              />
              <textlabel
                Position={UDim2.fromOffset(0, 40)}
                Size={UDim2.fromOffset(388, 70)}
                Text="Click outside the content or use the Close button."
                TextWrapped={true}
                ZIndex={11}
                className="text-ink-400 text-base text-left align-top"
              />
              <Dialog.Close asChild>
                <textbutton
                  AutoButtonColor={false}
                  Position={UDim2.fromOffset(0, 132)}
                  Text="Close Dialog"
                  ZIndex={11}
                  className="w-37.5 h-10 bg-surface text-ink text-base"
                />
              </Dialog.Close>
            </frame>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Form dialog */}
      <Dialog.Root modal={false} onOpenChange={setFormOpen} open={formOpen}>
        <Dialog.Trigger asChild>
          <textbutton
            AutoButtonColor={false}
            Text={formOpen ? "Form Opened" : "Open Form"}
            className="left-46.5 top-29.5 w-42.5 h-10.5 bg-surface text-ink text-base"
          />
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Content>
            <frame
              AnchorPoint={new Vector2(0.5, 0.5)}
              Position={UDim2.fromScale(0.5, 0.5)}
              className="w-115 h-75 z-10 bg-surface-100 rounded-lg border border-edge p-4"
            >
              <textlabel
                Size={UDim2.fromOffset(428, 30)}
                Text="Edit Profile"
                ZIndex={11}
                className="text-ink text-xl text-left"
              />
              <textlabel
                Position={UDim2.fromOffset(0, 38)}
                Size={UDim2.fromOffset(428, 40)}
                Text="Update the name shown to other players. Changes apply immediately."
                TextWrapped={true}
                ZIndex={11}
                className="text-ink-400 text-base text-left align-top"
              />

              {/* Body: labeled field */}
              <textlabel
                Position={UDim2.fromOffset(0, 92)}
                Size={UDim2.fromOffset(428, 18)}
                Text="Display name"
                ZIndex={11}
                className="text-ink-400 text-sm text-left"
              />
              <frame
                Position={UDim2.fromOffset(0, 114)}
                ZIndex={11}
                className="w-107 h-11 bg-surface rounded-md border border-edge px-3"
              >
                <textlabel
                  Size={UDim2.fromScale(1, 1)}
                  Text="Nimbus_Rider"
                  ZIndex={12}
                  className="text-ink text-base text-left"
                />
              </frame>

              {/* Footer actions */}
              <Dialog.Close asChild>
                <textbutton
                  AutoButtonColor={false}
                  Position={UDim2.fromOffset(0, 186)}
                  Text="Cancel"
                  ZIndex={11}
                  className="w-35 h-10 bg-surface text-ink text-base"
                />
              </Dialog.Close>
              <Dialog.Close asChild>
                <textbutton
                  AutoButtonColor={false}
                  Position={UDim2.fromOffset(288, 186)}
                  Text="Save Changes"
                  ZIndex={11}
                  className="w-35 h-10 bg-accent text-accent-50 text-base"
                />
              </Dialog.Close>
            </frame>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Destructive / confirm dialog */}
      <Dialog.Root modal={false} onOpenChange={setConfirmOpen} open={confirmOpen}>
        <Dialog.Trigger asChild>
          <textbutton
            AutoButtonColor={false}
            Text={confirmOpen ? "Confirm Opened" : "Delete Save"}
            className="left-93 top-29.5 w-42.5 h-10.5 bg-danger text-danger-50 text-base"
          />
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Content>
            <frame
              AnchorPoint={new Vector2(0.5, 0.5)}
              Position={UDim2.fromScale(0.5, 0.5)}
              className="w-110 h-55 z-10 bg-surface-100 rounded-lg border border-danger p-4"
            >
              <textlabel
                Size={UDim2.fromOffset(408, 30)}
                Text="Delete save file?"
                ZIndex={11}
                className="text-danger text-xl text-left"
              />
              <textlabel
                Position={UDim2.fromOffset(0, 40)}
                Size={UDim2.fromOffset(408, 70)}
                Text="This permanently removes the current progress. This action cannot be undone."
                TextWrapped={true}
                ZIndex={11}
                className="text-ink-400 text-base text-left align-top"
              />
              <Dialog.Close asChild>
                <textbutton
                  AutoButtonColor={false}
                  Event={{
                    Activated: () => {
                      setLastAction("cancelled");
                    },
                  }}
                  Position={UDim2.fromOffset(0, 140)}
                  Text="Cancel"
                  ZIndex={11}
                  className="w-35 h-10 bg-surface text-ink text-base"
                />
              </Dialog.Close>
              <Dialog.Close asChild>
                <textbutton
                  AutoButtonColor={false}
                  Event={{
                    Activated: () => {
                      setLastAction("deleted");
                    },
                  }}
                  Position={UDim2.fromOffset(268, 140)}
                  Text="Delete"
                  ZIndex={11}
                  className="w-35 h-10 bg-danger text-danger-50 text-base"
                />
              </Dialog.Close>
            </frame>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </frame>
  );
}
