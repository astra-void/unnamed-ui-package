import { Avatar } from "@lattice-ui/vide-avatar";
import { bindDerivedProps, Vide } from "@lattice-ui/vide-runtime";
import { mergeGuiProps, useTheme } from "@lattice-ui/vide-style";
import { panelRecipe } from "../theme/recipes";
import { ScenePanel, SceneReadout, SceneRoot } from "./parts";

type Person = { name: string; initials: string; src?: string };

const PEOPLE: Person[] = [
  { name: "Loaded image", initials: "LI", src: "rbxassetid://11563896029" },
  { name: "Broken image", initials: "BI", src: "rbxassetid://1" },
  { name: "No image at all", initials: "NA" },
];

function AvatarCard(props: { person: Person; order: number }) {
  const { theme } = useTheme();

  return (
    <frame BackgroundTransparency={1} LayoutOrder={props.order} Size={UDim2.fromOffset(200, 96)}>
      <Avatar.Root src={props.person.src} delayMs={200}>
        {() => (
          <frame
            {...bindDerivedProps<Frame>(() =>
              mergeGuiProps(panelRecipe({ tone: "elevated" }, theme()), {
                Position: UDim2.fromOffset(70, 0),
                Size: UDim2.fromOffset(60, 60),
              }),
            )}
          >
            <uicorner CornerRadius={new UDim(1, 0)} />
            <Avatar.Image BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
              {() => <uicorner CornerRadius={new UDim(1, 0)} />}
            </Avatar.Image>
            <Avatar.Fallback
              BackgroundTransparency={1}
              Size={UDim2.fromScale(1, 1)}
              Text={props.person.initials}
              TextColor3={() => theme().colors.textPrimary}
              TextSize={() => theme().typography.titleMd.textSize}
            />
          </frame>
        )}
      </Avatar.Root>
      <textlabel
        BackgroundTransparency={1}
        Position={UDim2.fromOffset(0, 66)}
        Size={UDim2.fromOffset(200, 24)}
        Text={props.person.name}
        TextColor3={() => theme().colors.textSecondary}
        TextSize={() => theme().typography.labelSm.textSize}
      />
    </frame>
  );
}

export function AvatarScene() {
  const { theme } = useTheme();

  return (
    <SceneRoot
      title="Avatar — the fallback waits before it appears"
      summary="A short delay keeps a fast-loading image from flashing its initials first."
    >
      <ScenePanel heading="TEAM" order={1}>
        <frame BackgroundTransparency={1} LayoutOrder={1} Size={UDim2.fromOffset(636, 100)}>
          <uilistlayout
            FillDirection={Enum.FillDirection.Horizontal}
            Padding={() => new UDim(0, theme().space[8])}
            SortOrder={Enum.SortOrder.LayoutOrder}
          />
          {PEOPLE.map((person, index) => (
            <AvatarCard person={person} order={index + 1} />
          ))}
        </frame>
        <SceneReadout
          order={2}
          text="Load state is the primitive's; which of the two children is mounted follows from it."
        />
      </ScenePanel>
    </SceneRoot>
  );
}
