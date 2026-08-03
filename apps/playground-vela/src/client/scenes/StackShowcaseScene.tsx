import { React } from "@lattice-ui/react-runtime";

type DemoTileProps = {
  label: string;
  layoutOrder: number;
  width?: number;
  height?: number;
  tone?: "accent" | "danger";
};

function DemoTile(props: DemoTileProps) {
  const width = props.width ?? 88;
  const height = props.height ?? 28;

  // Width/height come in as numbers, so `Size` stays a prop: `w-*` resolves a
  // spacing key at compile time and cannot read a variable.
  if (props.tone === "danger") {
    return (
      <frame LayoutOrder={props.layoutOrder} Size={UDim2.fromOffset(width, height)} className="bg-danger rounded-sm">
        <textlabel
          AnchorPoint={new Vector2(0.5, 0.5)}
          Position={UDim2.fromScale(0.5, 0.5)}
          Size={UDim2.fromOffset(width - 8, 20)}
          Text={props.label}
          className="text-danger-50 text-sm"
        />
      </frame>
    );
  }

  return (
    <frame LayoutOrder={props.layoutOrder} Size={UDim2.fromOffset(width, height)} className="bg-accent rounded-sm">
      <textlabel
        AnchorPoint={new Vector2(0.5, 0.5)}
        Position={UDim2.fromScale(0.5, 0.5)}
        Size={UDim2.fromOffset(width - 8, 20)}
        Text={props.label}
        className="text-accent-50 text-sm"
      />
    </frame>
  );
}

function SectionHeader(props: { title: string; hint: string; layoutOrder: number }) {
  return (
    <frame
      AutomaticSize={Enum.AutomaticSize.Y}
      LayoutOrder={props.layoutOrder}
      className="w-225 bg-transparent flex-col gap-0.5"
    >
      <textlabel
        LayoutOrder={1}
        Size={UDim2.fromOffset(900, 18)}
        Text={props.title}
        className="text-ink-400 text-sm text-left"
      />
      {/* `TextTransparency` has no utility — `opacity-*` targets the background. */}
      <textlabel
        LayoutOrder={2}
        Size={UDim2.fromOffset(900, 18)}
        Text={props.hint}
        TextTransparency={0.25}
        className="text-ink-400 text-sm text-left"
      />
    </frame>
  );
}

function PanelLabel(props: { text: string; layoutOrder?: number }) {
  return (
    <textlabel
      LayoutOrder={props.layoutOrder ?? 1}
      Size={UDim2.fromOffset(860, 20)}
      Text={props.text}
      className="text-ink text-base text-left"
    />
  );
}

const SPACING_ROWS = [4, 8, 12, 16, 24];
const ALIGNMENTS = ["start", "center", "end"] as const;

/**
 * `Stack`, `Row` and `Surface` are gone from this port: they exist to emit a
 * `UIListLayout` (plus optional `UIPadding`) and a toned background, which is
 * exactly what `flex-col`/`flex-row`, `gap-*`, `p-*` and `bg-*` lower to. What
 * they still buy over utilities is the density scale — `gap={8}` resolves
 * through `theme.space` and reacts to the density toggle, while `gap-2` is
 * frozen at 8px when the file compiles.
 */
export function StackShowcaseScene() {
  return (
    <frame AutomaticSize={Enum.AutomaticSize.Y} className="w-230 bg-transparent flex-col gap-3">
      <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={1} className="w-225 bg-transparent flex-col gap-1">
        <textlabel
          LayoutOrder={1}
          Size={UDim2.fromOffset(900, 28)}
          Text="Stack / Row: layout primitives generate UIListLayout + optional UIPadding."
          className="text-ink text-xl text-left"
        />
        <textlabel
          LayoutOrder={2}
          Size={UDim2.fromOffset(900, 20)}
          Text="Here they are utilities instead: flex-col / flex-row + gap-* + p-*."
          className="text-ink-400 text-base text-left"
        />
      </frame>

      <SectionHeader
        hint="Same three tiles laid out vertically vs horizontally from one primitive."
        layoutOrder={2}
        title="DIRECTION — VERTICAL vs HORIZONTAL"
      />
      <frame AutomaticSize={Enum.AutomaticSize.Y} LayoutOrder={3} className="w-225 bg-transparent flex-row gap-2.5">
        {/* 295 and 595 are not multiples of 4, so `w-*` cannot express them. */}
        <frame LayoutOrder={1} Size={UDim2.fromOffset(295, 170)} className="bg-surface rounded-lg p-3 flex-col gap-2">
          <PanelLabel text="Stack (vertical, gap=8)" />
          <DemoTile label="A" layoutOrder={2} width={120} />
          <DemoTile label="B" layoutOrder={3} width={120} />
          <DemoTile label="C" layoutOrder={4} width={120} />
        </frame>
        <frame LayoutOrder={2} Size={UDim2.fromOffset(595, 170)} className="bg-surface rounded-lg p-3 flex-col gap-2">
          <PanelLabel text="Row (horizontal, gap=8)" />
          <frame AutomaticSize={Enum.AutomaticSize.XY} LayoutOrder={2} className="bg-transparent flex-row gap-2">
            <DemoTile label="A" layoutOrder={1} />
            <DemoTile label="B" layoutOrder={2} />
            <DemoTile label="C" layoutOrder={3} />
          </frame>
          <PanelLabel layoutOrder={3} text="Nested: Row of vertical Stacks" />
          <frame AutomaticSize={Enum.AutomaticSize.XY} LayoutOrder={4} className="bg-transparent flex-row gap-2.5">
            <frame AutomaticSize={Enum.AutomaticSize.XY} className="bg-transparent flex-col gap-1">
              <DemoTile label="x1" layoutOrder={1} width={70} height={22} />
              <DemoTile label="x2" layoutOrder={2} width={70} height={22} />
            </frame>
            <frame AutomaticSize={Enum.AutomaticSize.XY} className="bg-transparent flex-col gap-1">
              <DemoTile label="y1" layoutOrder={1} width={70} height={22} tone="danger" />
              <DemoTile label="y2" layoutOrder={2} width={70} height={22} tone="danger" />
            </frame>
            <frame AutomaticSize={Enum.AutomaticSize.XY} className="bg-transparent flex-col gap-1">
              <DemoTile label="z1" layoutOrder={1} width={70} height={22} />
              <DemoTile label="z2" layoutOrder={2} width={70} height={22} />
            </frame>
          </frame>
        </frame>
      </frame>

      <SectionHeader
        hint="Identical tiles, gap stepped across the spacing scale so token differences are directly visible."
        layoutOrder={4}
        title="SPACING TOKENS COMPARED"
      />
      {/*
        The gap steps 4/8/12/16/24 are data, and a `gap-*` class cannot read a
        variable — so each row is written out with its own literal utility.
      */}
      <frame LayoutOrder={5} className="w-225 h-52.5 bg-surface-100 rounded-lg p-3 flex-col gap-1.5">
        <frame LayoutOrder={1} className="w-216 h-6 bg-transparent flex-row items-center gap-2.5">
          <textlabel
            LayoutOrder={1}
            Size={UDim2.fromOffset(96, 24)}
            Text={`gap=${SPACING_ROWS[0]}`}
            className="text-ink-400 text-sm text-left align-middle"
          />
          <frame AutomaticSize={Enum.AutomaticSize.XY} LayoutOrder={2} className="bg-transparent flex-row gap-1">
            <DemoTile label="1" layoutOrder={1} width={44} height={24} />
            <DemoTile label="2" layoutOrder={2} width={44} height={24} />
            <DemoTile label="3" layoutOrder={3} width={44} height={24} />
            <DemoTile label="4" layoutOrder={4} width={44} height={24} />
          </frame>
        </frame>
        <frame LayoutOrder={2} className="w-216 h-6 bg-transparent flex-row items-center gap-2.5">
          <textlabel
            LayoutOrder={1}
            Size={UDim2.fromOffset(96, 24)}
            Text={`gap=${SPACING_ROWS[1]}`}
            className="text-ink-400 text-sm text-left align-middle"
          />
          <frame AutomaticSize={Enum.AutomaticSize.XY} LayoutOrder={2} className="bg-transparent flex-row gap-2">
            <DemoTile label="1" layoutOrder={1} width={44} height={24} />
            <DemoTile label="2" layoutOrder={2} width={44} height={24} />
            <DemoTile label="3" layoutOrder={3} width={44} height={24} />
            <DemoTile label="4" layoutOrder={4} width={44} height={24} />
          </frame>
        </frame>
        <frame LayoutOrder={3} className="w-216 h-6 bg-transparent flex-row items-center gap-2.5">
          <textlabel
            LayoutOrder={1}
            Size={UDim2.fromOffset(96, 24)}
            Text={`gap=${SPACING_ROWS[2]}`}
            className="text-ink-400 text-sm text-left align-middle"
          />
          <frame AutomaticSize={Enum.AutomaticSize.XY} LayoutOrder={2} className="bg-transparent flex-row gap-3">
            <DemoTile label="1" layoutOrder={1} width={44} height={24} />
            <DemoTile label="2" layoutOrder={2} width={44} height={24} />
            <DemoTile label="3" layoutOrder={3} width={44} height={24} />
            <DemoTile label="4" layoutOrder={4} width={44} height={24} />
          </frame>
        </frame>
        <frame LayoutOrder={4} className="w-216 h-6 bg-transparent flex-row items-center gap-2.5">
          <textlabel
            LayoutOrder={1}
            Size={UDim2.fromOffset(96, 24)}
            Text={`gap=${SPACING_ROWS[3]}`}
            className="text-ink-400 text-sm text-left align-middle"
          />
          <frame AutomaticSize={Enum.AutomaticSize.XY} LayoutOrder={2} className="bg-transparent flex-row gap-4">
            <DemoTile label="1" layoutOrder={1} width={44} height={24} />
            <DemoTile label="2" layoutOrder={2} width={44} height={24} />
            <DemoTile label="3" layoutOrder={3} width={44} height={24} />
            <DemoTile label="4" layoutOrder={4} width={44} height={24} />
          </frame>
        </frame>
        <frame LayoutOrder={5} className="w-216 h-6 bg-transparent flex-row items-center gap-2.5">
          <textlabel
            LayoutOrder={1}
            Size={UDim2.fromOffset(96, 24)}
            Text={`gap=${SPACING_ROWS[4]}`}
            className="text-ink-400 text-sm text-left align-middle"
          />
          <frame AutomaticSize={Enum.AutomaticSize.XY} LayoutOrder={2} className="bg-transparent flex-row gap-6">
            <DemoTile label="1" layoutOrder={1} width={44} height={24} />
            <DemoTile label="2" layoutOrder={2} width={44} height={24} />
            <DemoTile label="3" layoutOrder={3} width={44} height={24} />
            <DemoTile label="4" layoutOrder={4} width={44} height={24} />
          </frame>
        </frame>
      </frame>

      <SectionHeader
        hint="justify sets main-axis placement; align sets cross-axis. Track is a fixed-width frame."
        layoutOrder={6}
        title="ALIGNMENT — justify (main) × align (cross)"
      />
      <frame LayoutOrder={7} className="w-225 h-47.5 bg-surface rounded-lg p-3 flex-col gap-2">
        <frame LayoutOrder={1} className="w-216 h-8.5 bg-canvas/40 flex-row justify-start items-center gap-2">
          <DemoTile label={`justify="${ALIGNMENTS[0]}"`} layoutOrder={1} width={140} />
          <DemoTile label="tile" layoutOrder={2} width={80} />
        </frame>
        <frame LayoutOrder={2} className="w-216 h-8.5 bg-canvas/40 flex-row justify-center items-center gap-2">
          <DemoTile label={`justify="${ALIGNMENTS[1]}"`} layoutOrder={1} width={140} />
          <DemoTile label="tile" layoutOrder={2} width={80} />
        </frame>
        <frame LayoutOrder={3} className="w-216 h-8.5 bg-canvas/40 flex-row justify-end items-center gap-2">
          <DemoTile label={`justify="${ALIGNMENTS[2]}"`} layoutOrder={1} width={140} />
          <DemoTile label="tile" layoutOrder={2} width={80} />
        </frame>
      </frame>

      <SectionHeader
        hint="AutomaticSize collapses the frame to its content on the chosen axis (none / Y / XY)."
        layoutOrder={8}
        title="AUTOSIZE EDGE CASES"
      />
      <frame LayoutOrder={9} className="w-225 h-37.5 bg-canvas rounded-lg p-3 flex-col gap-2">
        <frame LayoutOrder={1} className="w-216 h-8 bg-transparent flex-row justify-start items-center gap-1.5">
          <DemoTile label="fixed track" layoutOrder={1} width={150} />
          <DemoTile label="no AutomaticSize" layoutOrder={2} width={110} />
        </frame>
        <frame
          AutomaticSize={Enum.AutomaticSize.X}
          LayoutOrder={2}
          className="bg-transparent flex-row justify-center items-end gap-1.5"
        >
          <DemoTile label="AutomaticSize.X" layoutOrder={1} width={150} />
          <DemoTile label="grows on dir axis" layoutOrder={2} width={150} />
        </frame>
        <frame
          AutomaticSize={Enum.AutomaticSize.XY}
          LayoutOrder={3}
          className="bg-transparent flex-row justify-end items-start gap-1.5"
        >
          <DemoTile label="AutomaticSize.XY" layoutOrder={1} width={150} />
          <DemoTile label="hugs content" layoutOrder={2} width={120} />
        </frame>
      </frame>
    </frame>
  );
}
