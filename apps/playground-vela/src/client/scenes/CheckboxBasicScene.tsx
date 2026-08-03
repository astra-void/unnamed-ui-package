import type { CheckedState } from "@lattice-ui/react-checkbox";
import { Checkbox } from "@lattice-ui/react-checkbox";
import { React } from "@lattice-ui/react-runtime";

function toCheckedLabel(value: CheckedState) {
  return value === "indeterminate" ? "indeterminate" : value ? "checked" : "unchecked";
}

function indicatorSymbol(value: CheckedState) {
  return value === "indeterminate" ? "-" : "✓";
}

function SectionHeader(props: { text: string; order: number }) {
  return (
    <textlabel
      LayoutOrder={props.order}
      Size={UDim2.fromOffset(860, 18)}
      Text={props.text}
      className="text-ink-400 text-sm text-left"
    />
  );
}

function CheckRow(props: {
  label: string;
  order: number;
  width?: number;
  disabled?: boolean;
  muted?: boolean;
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  symbol: string;
  onCheckedChange?: (checked: CheckedState) => void;
}) {
  const width = props.width ?? 610;

  return (
    <Checkbox.Root
      asChild
      checked={props.checked}
      defaultChecked={props.defaultChecked}
      disabled={props.disabled}
      onCheckedChange={props.onCheckedChange}
    >
      <textbutton
        AutoButtonColor={false}
        LayoutOrder={props.order}
        Size={UDim2.fromOffset(width, 40)}
        Text=""
        className="bg-surface text-ink text-base"
      >
        <frame Position={UDim2.fromOffset(12, 8)} className="w-6 h-6 bg-surface-100 rounded-sm">
          <Checkbox.Indicator asChild forceMount>
            {props.muted === true ? (
              <textlabel Size={UDim2.fromScale(1, 1)} Text={props.symbol} className="text-ink-400 text-base" />
            ) : (
              <textlabel Size={UDim2.fromScale(1, 1)} Text={props.symbol} className="text-ink text-base" />
            )}
          </Checkbox.Indicator>
        </frame>
        {props.muted === true ? (
          <textlabel
            Position={UDim2.fromOffset(48, 0)}
            Size={UDim2.fromOffset(width - 60, 40)}
            Text={props.label}
            className="text-ink-400 text-base text-left"
          />
        ) : (
          <textlabel
            Position={UDim2.fromOffset(48, 0)}
            Size={UDim2.fromOffset(width - 60, 40)}
            Text={props.label}
            className="text-ink text-base text-left"
          />
        )}
      </textbutton>
    </Checkbox.Root>
  );
}

const CHILD_LABELS = ["Push notifications", "Email digest", "Product announcements"];

export function CheckboxBasicScene() {
  const [controlled, setControlled] = React.useState<CheckedState>("indeterminate");
  const [uncontrolled, setUncontrolled] = React.useState<CheckedState>("indeterminate");
  const [children, setChildren] = React.useState<Array<boolean>>([true, false, false]);

  const checkedCount = children.filter((value) => value).size();
  const allChecked = checkedCount === children.size();
  const noneChecked = checkedCount === 0;
  const parentState: CheckedState = allChecked ? true : noneChecked ? false : "indeterminate";

  const toggleAll = React.useCallback(() => {
    setChildren((current) => {
      const shouldCheckAll = current.filter((value) => value).size() !== current.size();
      return current.map(() => shouldCheckAll);
    });
  }, []);

  const setChildAt = React.useCallback((index: number, nextValue: boolean) => {
    setChildren((current) => current.map((value, i) => (i === index ? nextValue : value)));
  }, []);

  return (
    <frame className="w-230 h-160 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(860, 28)}
        Text="Checkbox: controlled/uncontrolled, indeterminate -> checked, tri-state select all, disabled"
        className="text-ink text-xl text-left truncate"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(860, 22)}
        Text={`Controlled: ${toCheckedLabel(controlled)} | Uncontrolled: ${toCheckedLabel(uncontrolled)} | Selected ${checkedCount}/${children.size()}`}
        className="text-ink-400 text-base text-left"
      />

      <frame className="top-17 w-230 h-140 bg-transparent flex-col gap-4">
        {/* States */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={1}
          className="w-160 bg-surface rounded-lg p-3 flex-col gap-2"
        >
          <SectionHeader text="STATES" order={1} />
          <CheckRow
            label={`Controlled (${toCheckedLabel(controlled)})`}
            order={2}
            checked={controlled}
            symbol={indicatorSymbol(controlled)}
            onCheckedChange={setControlled}
          />
          <CheckRow
            label={`Uncontrolled (${toCheckedLabel(uncontrolled)})`}
            order={3}
            defaultChecked="indeterminate"
            symbol={indicatorSymbol(uncontrolled)}
            onCheckedChange={setUncontrolled}
          />
          <CheckRow label="Disabled checked" order={4} checked={true} disabled muted symbol="✓" />
        </frame>

        {/* Tri-state select all */}
        <frame
          AutomaticSize={Enum.AutomaticSize.Y}
          LayoutOrder={2}
          className="w-160 bg-surface rounded-lg p-3 flex-col gap-1.5"
        >
          <SectionHeader text="TRI-STATE SELECT ALL" order={1} />

          {/* Parent: indeterminate when only some children are checked */}
          <Checkbox.Root asChild checked={parentState} onCheckedChange={toggleAll}>
            <textbutton
              AutoButtonColor={false}
              LayoutOrder={2}
              Text=""
              className="w-152.5 h-10 bg-surface text-ink text-base"
            >
              <frame Position={UDim2.fromOffset(12, 8)} className="w-6 h-6 bg-surface-100 rounded-sm">
                <Checkbox.Indicator asChild forceMount>
                  <textlabel
                    Size={UDim2.fromScale(1, 1)}
                    Text={indicatorSymbol(parentState)}
                    className="text-ink text-base"
                  />
                </Checkbox.Indicator>
              </frame>
              <textlabel
                Position={UDim2.fromOffset(48, 0)}
                Size={UDim2.fromOffset(540, 40)}
                Text={`All subscriptions (${toCheckedLabel(parentState)})`}
                className="text-ink text-base text-left"
              />
            </textbutton>
          </Checkbox.Root>

          {children.map((childChecked, index) => (
            <CheckRow
              key={`child-${index}`}
              label={CHILD_LABELS[index]}
              order={10 + index}
              width={586}
              checked={childChecked}
              symbol="✓"
              onCheckedChange={(nextChecked) => {
                setChildAt(index, nextChecked !== false);
              }}
            />
          ))}
        </frame>
      </frame>

      <textbutton
        AutoButtonColor={false}
        AutomaticSize={Enum.AutomaticSize.X}
        Event={{
          Activated: () => {
            setControlled("indeterminate");
          },
        }}
        Position={UDim2.fromOffset(660, 68)}
        Size={new UDim2(0, 0, 0, 36)}
        Text="Set Controlled Indeterminate"
        className="bg-accent text-accent-50 text-base px-4"
      />
    </frame>
  );
}
