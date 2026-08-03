import { Combobox } from "@lattice-ui/react-combobox";
import { React } from "@lattice-ui/react-runtime";

const DATASET = [
  "apricot",
  "blueberry",
  "cherry",
  "cranberry",
  "grapefruit",
  "kiwi",
  "lemon",
  "lychee",
  "mango",
  "nectarine",
  "papaya",
  "raspberry",
];

function queryMatches(text: string, query: string) {
  if (query === "") {
    return true;
  }
  const [matchStart] = string.find(string.lower(text), string.lower(query), 1, true);
  return matchStart !== undefined;
}

function OptionItem(props: { value: string }) {
  return (
    <Combobox.Item asChild textValue={props.value} value={props.value}>
      <textbutton
        AutoButtonColor={false}
        Size={UDim2.fromOffset(288, 30)}
        Text={props.value}
        className="bg-surface-100 text-ink text-sm text-left pl-2"
      />
    </Combobox.Item>
  );
}

export function ComboboxBasicScene() {
  const [value, setValue] = React.useState<string | undefined>("apricot");
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const matchCount = DATASET.filter((option) => queryMatches(option, query)).size();

  return (
    <frame className="w-235 h-115 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(920, 28)}
        Text="Combobox: type-to-filter + enforced selection"
        className="text-ink text-xl text-left"
      />
      <textlabel
        Position={UDim2.fromOffset(0, 34)}
        Size={UDim2.fromOffset(920, 24)}
        Text={`open: ${open ? "true" : "false"} | value: ${value ?? "(none)"} | query: "${query}" | matches: ${matchCount}/${DATASET.size()}`}
        className="text-ink-400 text-base text-left"
      />

      <frame className="top-19 w-225 h-82.5 bg-surface rounded-lg p-3 flex-col gap-2.5">
        <textlabel
          LayoutOrder={0}
          Size={UDim2.fromOffset(860, 18)}
          Text="12-item dataset — filter is case-insensitive substring; Enter/Space commits, empty query clears the filter"
          className="text-ink-400 text-sm text-left truncate"
        />

        <Combobox.Root onInputValueChange={setQuery} onOpenChange={setOpen} onValueChange={setValue} value={value}>
          <frame LayoutOrder={1} Size={UDim2.fromOffset(860, 86)} className="bg-transparent flex-col gap-1.5">
            <Combobox.Trigger asChild>
              <textbutton
                AutoButtonColor={false}
                Size={UDim2.fromOffset(320, 40)}
                Text=""
                className="bg-surface text-ink text-base"
              >
                <textlabel
                  Position={UDim2.fromOffset(12, 0)}
                  Size={UDim2.fromOffset(84, 40)}
                  Text="Selected"
                  className="text-ink-400 text-sm text-left"
                />
                <Combobox.Value asChild placeholder="Select fruit">
                  <textlabel
                    Position={UDim2.fromOffset(88, 0)}
                    Size={UDim2.fromOffset(212, 40)}
                    className="text-ink text-base text-left"
                  />
                </Combobox.Value>
              </textbutton>
            </Combobox.Trigger>

            <Combobox.Input asChild placeholder="Type to filter (e.g. berry, an, ly)...">
              <textbox
                Size={UDim2.fromOffset(320, 34)}
                className="bg-surface-100 text-ink text-base text-left rounded-md px-2"
              />
            </Combobox.Input>
          </frame>

          <Combobox.Portal>
            <Combobox.Content asChild sideOffset={8} placement="bottom">
              <frame className="w-80 h-50 bg-surface rounded-md p-2">
                {/* Empty state — visible only when the query filters everything out */}
                <textlabel
                  Size={UDim2.fromScale(1, 1)}
                  Text={`No results for "${query}"`}
                  TextWrapped
                  Visible={matchCount === 0}
                  className="text-ink-400 text-base"
                />

                <scrollingframe
                  Active
                  AutomaticCanvasSize={Enum.AutomaticSize.Y}
                  CanvasSize={new UDim2()}
                  ScrollBarThickness={4}
                  ScrollingDirection={Enum.ScrollingDirection.Y}
                  Size={UDim2.fromScale(1, 1)}
                  Visible={matchCount > 0}
                  className="bg-transparent flex-col gap-1"
                >
                  {DATASET.map((option) => (
                    <OptionItem key={option} value={option} />
                  ))}
                </scrollingframe>
              </frame>
            </Combobox.Content>
          </Combobox.Portal>
        </Combobox.Root>
      </frame>
    </frame>
  );
}
