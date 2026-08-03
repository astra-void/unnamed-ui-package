import { React } from "@lattice-ui/react-runtime";
import { ToggleGroup } from "@lattice-ui/react-toggle-group";

function formatSingleValue(value: string | undefined) {
  return value ?? "none";
}

function formatMultipleValue(value: string[]) {
  return value.size() > 0 ? value.join(", ") : "none";
}

function SectionHeader(props: { text: string; order: number }) {
  return (
    <textlabel
      LayoutOrder={props.order}
      Size={UDim2.fromOffset(860, 20)}
      Text={props.text}
      className="text-ink-400 text-sm text-left"
    />
  );
}

/**
 * The sibling scene builds these with one `renderIconToggle(value, glyph,
 * active, disabled)` that assembles a prop override table and hands it to
 * `buttonRecipe`. Utilities cannot be assembled that way and `asChild` needs a
 * host child, so the three states are three literal elements.
 */
function IconToggle(props: { value: string; glyph: string; active: boolean; disabled: boolean }) {
  if (props.disabled) {
    return (
      <ToggleGroup.Item asChild disabled value={props.value}>
        <textbutton
          Active={false}
          AutoButtonColor={false}
          Selectable={false}
          Text={props.glyph}
          className="w-11.5 h-8.5 bg-surface text-ink-400 text-base rounded-md"
        />
      </ToggleGroup.Item>
    );
  }

  return (
    <ToggleGroup.Item asChild value={props.value}>
      {props.active ? (
        <textbutton
          AutoButtonColor={false}
          Text={props.glyph}
          className="w-11.5 h-8.5 bg-accent text-accent-50 text-base rounded-md"
        />
      ) : (
        <textbutton
          AutoButtonColor={false}
          Text={props.glyph}
          className="w-11.5 h-8.5 bg-surface text-ink text-base rounded-md"
        />
      )}
    </ToggleGroup.Item>
  );
}

function WideToggle(props: { value: string; label: string; active: boolean }) {
  return (
    <ToggleGroup.Item asChild value={props.value}>
      {props.active ? (
        <textbutton
          AutoButtonColor={false}
          Text={props.label}
          className="w-42.5 h-8.5 bg-accent text-accent-50 text-base"
        />
      ) : (
        <textbutton AutoButtonColor={false} Text={props.label} className="w-42.5 h-8.5 bg-surface text-ink text-base" />
      )}
    </ToggleGroup.Item>
  );
}

export function ToggleGroupBasicScene() {
  const [singleControlled, setSingleControlled] = React.useState<string | undefined>("alpha");
  const [singleUncontrolledMirror, setSingleUncontrolledMirror] = React.useState<string | undefined>("beta");

  const [multipleControlled, setMultipleControlled] = React.useState<Array<string>>(["bold"]);
  const [multipleUncontrolledMirror, setMultipleUncontrolledMirror] = React.useState<Array<string>>(["left"]);

  const [toolbarAlign, setToolbarAlign] = React.useState<string | undefined>("left");
  const [toolbarFormat, setToolbarFormat] = React.useState<Array<string>>(["bold"]);

  return (
    <frame AutomaticSize={Enum.AutomaticSize.Y} className="w-240 bg-transparent flex-col gap-2">
      <textlabel
        LayoutOrder={1}
        Size={UDim2.fromOffset(930, 28)}
        Text="ToggleGroup: icon toolbar, single/multiple controlled + uncontrolled, single re-click clears selection."
        className="text-ink text-xl text-left truncate"
      />
      <textlabel
        LayoutOrder={2}
        Size={UDim2.fromOffset(930, 22)}
        Text={`toolbar align=${formatSingleValue(toolbarAlign)} | format=${formatMultipleValue(toolbarFormat)}`}
        className="text-ink-400 text-base text-left"
      />
      <textlabel
        LayoutOrder={3}
        Size={UDim2.fromOffset(930, 22)}
        Text={`single(controlled)=${formatSingleValue(singleControlled)} | single(uncontrolled)=${formatSingleValue(singleUncontrolledMirror)}`}
        className="text-ink-400 text-base text-left"
      />
      <textlabel
        LayoutOrder={4}
        Size={UDim2.fromOffset(930, 22)}
        Text={`multiple(controlled)=${formatMultipleValue(multipleControlled)} | multiple(uncontrolled)=${formatMultipleValue(multipleUncontrolledMirror)}`}
        className="text-ink-400 text-base text-left"
      />

      {/* Icon-style toolbar: alignment (single, with a disabled item) + formatting (multiple) */}
      <frame
        AutomaticSize={Enum.AutomaticSize.Y}
        LayoutOrder={5}
        className="w-230 bg-surface rounded-lg p-3 flex-col gap-2.5"
      >
        <SectionHeader order={1} text="Toolbar - alignment (single) + formatting (multiple), 'Justify' is disabled" />

        <frame LayoutOrder={2} className="w-220 h-8.5 bg-transparent flex-row gap-2.5">
          <ToggleGroup.Root onValueChange={setToolbarAlign} type="single" value={toolbarAlign}>
            <frame className="w-53.5 h-8.5 bg-transparent flex-row gap-1.5">
              <IconToggle value="left" glyph="L" active={toolbarAlign === "left"} disabled={false} />
              <IconToggle value="center" glyph="C" active={toolbarAlign === "center"} disabled={false} />
              <IconToggle value="right" glyph="R" active={toolbarAlign === "right"} disabled={false} />
              <IconToggle value="justify" glyph="J" active={toolbarAlign === "justify"} disabled={true} />
            </frame>
          </ToggleGroup.Root>

          <ToggleGroup.Root onValueChange={setToolbarFormat} type="multiple" value={toolbarFormat}>
            <frame className="w-40.5 h-8.5 bg-transparent flex-row gap-1.5">
              <IconToggle value="bold" glyph="B" active={toolbarFormat.includes("bold")} disabled={false} />
              <IconToggle value="italic" glyph="I" active={toolbarFormat.includes("italic")} disabled={false} />
              <IconToggle value="underline" glyph="U" active={toolbarFormat.includes("underline")} disabled={false} />
            </frame>
          </ToggleGroup.Root>
        </frame>
      </frame>

      {/* Single + multiple, controlled and uncontrolled parity */}
      <frame
        AutomaticSize={Enum.AutomaticSize.Y}
        LayoutOrder={6}
        className="w-230 bg-surface rounded-lg p-3 flex-col gap-3"
      >
        <SectionHeader order={1} text="Single - controlled (click selected again to clear to none)" />

        <ToggleGroup.Root onValueChange={setSingleControlled} type="single" value={singleControlled}>
          <frame LayoutOrder={2} className="w-215 h-9.5 bg-transparent flex-row gap-2">
            <WideToggle value="alpha" label="Alpha" active={singleControlled === "alpha"} />
            <WideToggle value="beta" label="Beta" active={singleControlled === "beta"} />
            <WideToggle value="gamma" label="Gamma" active={singleControlled === "gamma"} />
          </frame>
        </ToggleGroup.Root>

        <SectionHeader order={3} text="Single - uncontrolled" />

        <ToggleGroup.Root defaultValue="beta" onValueChange={setSingleUncontrolledMirror} type="single">
          <frame LayoutOrder={4} className="w-215 h-9.5 bg-transparent flex-row gap-2">
            <WideToggle value="alpha" label="Alpha" active={singleUncontrolledMirror === "alpha"} />
            <WideToggle value="beta" label="Beta" active={singleUncontrolledMirror === "beta"} />
            <WideToggle value="gamma" label="Gamma" active={singleUncontrolledMirror === "gamma"} />
          </frame>
        </ToggleGroup.Root>

        <SectionHeader order={5} text="Multiple - controlled" />

        <ToggleGroup.Root onValueChange={setMultipleControlled} type="multiple" value={multipleControlled}>
          <frame LayoutOrder={6} className="w-215 h-9.5 bg-transparent flex-row gap-2">
            <WideToggle value="bold" label="Bold" active={multipleControlled.includes("bold")} />
            <WideToggle value="italic" label="Italic" active={multipleControlled.includes("italic")} />
            <WideToggle value="underline" label="Underline" active={multipleControlled.includes("underline")} />
          </frame>
        </ToggleGroup.Root>

        <SectionHeader order={7} text="Multiple - uncontrolled" />

        <ToggleGroup.Root defaultValue={["left"]} onValueChange={setMultipleUncontrolledMirror} type="multiple">
          <frame LayoutOrder={8} className="w-215 h-9.5 bg-transparent flex-row gap-2">
            <WideToggle value="left" label="Left" active={multipleUncontrolledMirror.includes("left")} />
            <WideToggle value="center" label="Center" active={multipleUncontrolledMirror.includes("center")} />
            <WideToggle value="right" label="Right" active={multipleUncontrolledMirror.includes("right")} />
          </frame>
        </ToggleGroup.Root>
      </frame>
    </frame>
  );
}
