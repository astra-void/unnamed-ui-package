import { React } from "@lattice-ui/react-runtime";
import { Toast } from "@lattice-ui/react-toast";

type ToastCardProps = {
  layoutOrder: number;
  /**
   * The tone stripe's fill, as a class rather than a `Color3`. It lands in an
   * array `className`, so the literal half stays on the compile-time path and
   * only this token drops to the runtime resolver — which handles `bg-*`.
   */
  accentClass: string;
  title: string;
  description?: string;
  actionLabel?: string;
};

function ToastCard(props: ToastCardProps) {
  const hasDescription = props.description !== undefined;

  return (
    <Toast.Root asChild>
      <frame
        LayoutOrder={props.layoutOrder}
        Size={UDim2.fromOffset(400, hasDescription ? 74 : 52)}
        className="bg-surface-100 rounded-md border border-edge pl-4 pr-2.5 py-2"
      >
        {/* Tone accent stripe */}
        <frame Size={new UDim2(0, 4, 1, 0)} className={[props.accentClass, "rounded-sm"]} />

        <Toast.Title asChild>
          <textlabel Size={UDim2.fromOffset(300, 20)} Text={props.title} className="text-ink text-sm text-left" />
        </Toast.Title>

        {hasDescription ? (
          <Toast.Description asChild>
            <textlabel
              Position={UDim2.fromOffset(0, 24)}
              Size={UDim2.fromOffset(330, 18)}
              Text={props.description ?? ""}
              className="text-ink-400 text-base text-left"
            />
          </Toast.Description>
        ) : undefined}

        {props.actionLabel !== undefined ? (
          <Toast.Action asChild>
            <textbutton
              AutoButtonColor={false}
              Position={UDim2.fromOffset(250, 20)}
              Text={props.actionLabel}
              className="w-27 h-8.5 bg-accent text-accent-50 text-base"
            />
          </Toast.Action>
        ) : undefined}

        <Toast.Close asChild>
          <textbutton
            AutoButtonColor={false}
            Position={UDim2.fromOffset(360, 0)}
            Text="X"
            className="w-6 h-5 bg-transparent text-ink-400 text-xs"
          />
        </Toast.Close>
      </frame>
    </Toast.Root>
  );
}

function SectionHeader(props: { text: string; layoutOrder: number }) {
  return (
    <textlabel
      LayoutOrder={props.layoutOrder}
      Size={UDim2.fromOffset(400, 20)}
      Text={props.text}
      className="text-ink-400 text-sm text-left"
    />
  );
}

export function ToastBasicScene() {
  return (
    <frame className="w-235 h-155 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(920, 28)}
        Text="Toast: declarative composition preview"
        className="text-ink text-xl text-left"
      />

      <frame className="top-12 w-115 h-140 bg-surface rounded-lg border border-edge p-4 flex-col gap-2">
        <SectionHeader layoutOrder={1} text="Tones" />
        <ToastCard
          accentClass="bg-[#2ea060]"
          description="Your preferences were updated."
          layoutOrder={2}
          title="Saved"
        />
        <ToastCard
          accentClass="bg-[#ca8a04]"
          description="Actions are queued and will retry."
          layoutOrder={3}
          title="Network unstable"
        />
        <ToastCard
          accentClass="bg-danger"
          description="The upload failed after 3 attempts."
          layoutOrder={4}
          title="Upload error"
        />
        <ToastCard
          accentClass="bg-accent"
          description="A new version is available."
          layoutOrder={5}
          title="Update ready"
        />

        <SectionHeader layoutOrder={6} text="Composition" />
        <ToastCard
          accentClass="bg-accent"
          actionLabel="Undo"
          description="The item was moved to the trash."
          layoutOrder={7}
          title="Item deleted"
        />
        <ToastCard accentClass="bg-[#2ea060]" layoutOrder={8} title="Copied to clipboard" />
      </frame>
    </frame>
  );
}
