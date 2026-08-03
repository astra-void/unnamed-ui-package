import { Dialog } from "@lattice-ui/react-dialog";
import { React } from "@lattice-ui/react-runtime";

export function ConfirmDialogScene() {
  const [open, setOpen] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);
  const [confirmCount, setConfirmCount] = React.useState(0);

  return (
    <frame className="w-230 h-130 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(900, 28)}
        Text="Confirm dialog: modal destructive flow with Cancel / Delete and a result banner"
        className="text-ink text-xl text-left truncate"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(900, 24)}
        Text={`open=${open ? "true" : "false"} | project=${deleted ? "deleted" : "active"} | confirms=${confirmCount}`}
        className="text-ink-400 text-base text-left"
      />

      <frame className="top-18 w-140 h-50 bg-surface rounded-lg border border-edge px-4 pt-4">
        <textlabel Size={UDim2.fromOffset(520, 22)} Text="Project: Aurora" className="text-ink text-base text-left" />
        {deleted ? (
          <textlabel
            Position={UDim2.fromOffset(0, 26)}
            Size={UDim2.fromOffset(520, 20)}
            Text="This project has been deleted."
            className="text-danger text-sm text-left"
          />
        ) : (
          <textlabel
            Position={UDim2.fromOffset(0, 26)}
            Size={UDim2.fromOffset(520, 20)}
            Text="Deleting a project cannot be undone."
            className="text-ink-400 text-sm text-left"
          />
        )}

        <Dialog.Root modal={true} onOpenChange={setOpen} open={open}>
          <Dialog.Trigger asChild>
            {/*
              `buttonRecipe({ intent: deleted ? "surface" : "danger" })` picks the
              variant from a value; without a variant model each intent is its
              own element.
            */}
            {deleted ? (
              <textbutton
                Active={false}
                AutoButtonColor={false}
                Text="Already deleted"
                className="top-16 w-45 h-10.5 bg-surface text-ink-400 text-base"
              />
            ) : (
              <textbutton
                AutoButtonColor={false}
                Text="Delete project"
                className="top-16 w-45 h-10.5 bg-danger text-danger-50 text-base"
              />
            )}
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Content>
              <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                Position={UDim2.fromScale(0.5, 0.5)}
                className="w-110 h-59 z-10 bg-surface-100 rounded-lg border border-edge px-5 py-4"
              >
                <textlabel
                  Size={UDim2.fromOffset(400, 28)}
                  Text="Delete project?"
                  ZIndex={11}
                  className="text-ink text-xl text-left"
                />
                <textlabel
                  Position={UDim2.fromOffset(0, 40)}
                  Size={UDim2.fromOffset(400, 72)}
                  Text="This permanently removes “Aurora” and all of its data. This action cannot be undone."
                  TextWrapped={true}
                  ZIndex={11}
                  className="text-ink-400 text-base text-left align-top"
                />

                <frame
                  Position={UDim2.fromOffset(0, 148)}
                  Size={UDim2.fromOffset(400, 44)}
                  ZIndex={11}
                  className="bg-transparent flex-row justify-end items-center gap-2"
                >
                  <Dialog.Close asChild>
                    <textbutton
                      AutoButtonColor={false}
                      LayoutOrder={1}
                      Text="Cancel"
                      ZIndex={11}
                      className="w-30 h-10 bg-surface text-ink text-base"
                    />
                  </Dialog.Close>
                  <Dialog.Close asChild>
                    <textbutton
                      AutoButtonColor={false}
                      Event={{
                        Activated: () => {
                          setDeleted(true);
                          setConfirmCount((count) => count + 1);
                        },
                      }}
                      LayoutOrder={2}
                      Text="Delete project"
                      ZIndex={11}
                      className="w-37.5 h-10 bg-danger text-danger-50 text-base"
                    />
                  </Dialog.Close>
                </frame>
              </frame>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </frame>

      {deleted ? (
        <frame
          Position={UDim2.fromOffset(0, 288)}
          Size={UDim2.fromOffset(560, 44)}
          className="bg-transparent flex-row items-center gap-2"
        >
          <textlabel
            LayoutOrder={1}
            Size={UDim2.fromOffset(280, 20)}
            Text="Project deleted."
            className="text-ink-400 text-base text-left"
          />
          <textbutton
            AutoButtonColor={false}
            Event={{
              Activated: () => {
                setDeleted(false);
              },
            }}
            LayoutOrder={2}
            Text="Restore"
            className="w-30 h-9 bg-surface text-ink text-base"
          />
        </frame>
      ) : undefined}
    </frame>
  );
}
