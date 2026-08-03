import { Accordion } from "@lattice-ui/react-accordion";
import { React } from "@lattice-ui/react-runtime";

type AccordionEntry = {
  value: string;
  title: string;
  body: string;
  disabled?: boolean;
};

const SINGLE_ITEMS: Array<AccordionEntry> = [
  {
    value: "account",
    title: "Account",
    body:
      "Manage your profile, display name, and linked identities. Only one section can be open at a " +
      "time in single mode, so opening another panel collapses this one with the reveal animation.",
  },
  {
    value: "billing",
    title: "Billing",
    body:
      "Review invoices, update your payment method, and change plans. This longer body demonstrates the " +
      "wrapped, multi-line disclosure content growing the item as it expands.",
  },
  {
    value: "security",
    title: "Security",
    body: "This item is disabled and cannot be expanded.",
    disabled: true,
  },
];

const MULTIPLE_ITEMS: Array<AccordionEntry> = [
  {
    value: "general",
    title: "General",
    body:
      "Language, timezone, and appearance preferences. In multiple mode any number of panels can stay " +
      "open at once, and each one animates independently as you toggle it.",
  },
  {
    value: "privacy",
    title: "Privacy",
    body: "Control who can see your activity and how your data is shared across the workspace.",
  },
  {
    value: "notifications",
    title: "Notifications",
    body: "Choose which events send email, push, and in-app alerts, and set quiet hours.",
  },
];

function AccordionEntryView(props: { entry: AccordionEntry }) {
  const entry = props.entry;
  return (
    <Accordion.Item asChild disabled={entry.disabled} value={entry.value}>
      <frame AutomaticSize={Enum.AutomaticSize.Y} className="w-215 bg-transparent flex-col gap-1.5">
        <Accordion.Header asChild>
          <frame LayoutOrder={1} className="w-215 h-8 bg-transparent">
            <Accordion.Trigger asChild>
              {entry.disabled === true ? (
                <textbutton
                  Text={`${entry.title} (Disabled)`}
                  className="w-215 h-8 bg-surface-100 text-ink-400 text-sm text-left rounded-md pl-2.5"
                />
              ) : (
                <textbutton
                  Text={entry.title}
                  className="w-215 h-8 bg-surface-100 text-ink text-sm text-left rounded-md pl-2.5"
                />
              )}
            </Accordion.Trigger>
          </frame>
        </Accordion.Header>

        <Accordion.Content asChild>
          <textlabel
            AutomaticSize={Enum.AutomaticSize.Y}
            LayoutOrder={2}
            Size={UDim2.fromOffset(840, 0)}
            Text={entry.body}
            TextWrapped
            className="text-ink-400 text-base text-left align-top pl-2.5"
          />
        </Accordion.Content>
      </frame>
    </Accordion.Item>
  );
}

export function AccordionBasicScene() {
  const [singleOpen, setSingleOpen] = React.useState<string>("account");
  const [multiOpen, setMultiOpen] = React.useState<Array<string>>(["general"]);

  return (
    <frame AutomaticSize={Enum.AutomaticSize.Y} className="w-235 bg-transparent flex-col gap-2">
      <textlabel
        LayoutOrder={1}
        Size={UDim2.fromOffset(920, 28)}
        Text="Accordion: single vs multiple, default-open, disabled item, and animated long-content disclosure"
        className="text-ink text-xl text-left truncate"
      />
      <textlabel
        LayoutOrder={2}
        Size={UDim2.fromOffset(920, 22)}
        Text={`single open=${singleOpen === "" ? "none" : singleOpen} | multiple open=${
          multiOpen.size() > 0 ? multiOpen.join(", ") : "none"
        }`}
        className="text-ink-400 text-base text-left"
      />

      {/* Single mode: one panel at a time, "Account" open by default, "Security" disabled */}
      <frame
        AutomaticSize={Enum.AutomaticSize.Y}
        LayoutOrder={3}
        className="w-225 bg-surface rounded-lg p-3 flex-col gap-1.5"
      >
        <textlabel
          LayoutOrder={1}
          Size={UDim2.fromOffset(860, 20)}
          Text="Single (collapsible) - default open: Account"
          className="text-ink-400 text-sm text-left"
        />

        <Accordion.Root
          collapsible
          defaultValue="account"
          onValueChange={(value) => setSingleOpen(typeIs(value, "string") ? value : (value[0] ?? ""))}
          type="single"
        >
          <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={2} className="w-215 bg-transparent flex-col gap-2">
            {SINGLE_ITEMS.map((entry) => (
              <AccordionEntryView key={entry.value} entry={entry} />
            ))}
          </frame>
        </Accordion.Root>
      </frame>

      {/* Multiple mode: any number of panels open at once */}
      <frame
        AutomaticSize={Enum.AutomaticSize.Y}
        LayoutOrder={4}
        className="w-225 bg-surface rounded-lg p-3 flex-col gap-1.5"
      >
        <textlabel
          LayoutOrder={1}
          Size={UDim2.fromOffset(860, 20)}
          Text="Multiple (collapsible) - default open: General"
          className="text-ink-400 text-sm text-left"
        />

        <Accordion.Root
          collapsible
          defaultValue={["general"]}
          onValueChange={(value) => setMultiOpen(typeIs(value, "string") ? [value] : value)}
          type="multiple"
        >
          <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={2} className="w-215 bg-transparent flex-col gap-2">
            {MULTIPLE_ITEMS.map((entry) => (
              <AccordionEntryView key={entry.value} entry={entry} />
            ))}
          </frame>
        </Accordion.Root>
      </frame>
    </frame>
  );
}
