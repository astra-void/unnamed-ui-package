import { React } from "@lattice-ui/react-runtime";

const Players = game.GetService("Players");
const GuiService = game.GetService("GuiService");
const UserInputService = game.GetService("UserInputService");

function isPointerInput(inputObject: InputObject) {
  return (
    inputObject.UserInputType === Enum.UserInputType.MouseButton1 ||
    inputObject.UserInputType === Enum.UserInputType.Touch
  );
}

function getNormalizedPointerSamples(pointerPosition: Vector2, ignoreGuiInset: boolean) {
  const [insetTopLeft] = GuiService.GetGuiInset();

  const samples: Vector2[] = [];
  const sampleKeys: Record<string, true> = {};

  const addSample = (x: number, y: number) => {
    const roundedX = math.round(x);
    const roundedY = math.round(y);
    const key = `${roundedX}:${roundedY}`;
    if (sampleKeys[key]) {
      return;
    }
    sampleKeys[key] = true;
    samples.push(new Vector2(roundedX, roundedY));
  };

  addSample(pointerPosition.X, pointerPosition.Y);
  addSample(pointerPosition.X + insetTopLeft.X, pointerPosition.Y + insetTopLeft.Y);
  addSample(pointerPosition.X - insetTopLeft.X, pointerPosition.Y - insetTopLeft.Y);

  if (ignoreGuiInset) {
    addSample(pointerPosition.X, pointerPosition.Y + insetTopLeft.Y);
    addSample(pointerPosition.X, pointerPosition.Y - insetTopLeft.Y);
    addSample(pointerPosition.X + insetTopLeft.X, pointerPosition.Y);
    addSample(pointerPosition.X - insetTopLeft.X, pointerPosition.Y);
  }

  return samples;
}

export function InsetHitTestScene() {
  const [ignoreGuiInset, setIgnoreGuiInset] = React.useState(true);
  const [lastResult, setLastResult] = React.useState("Click screen to inspect outside hit-test samples.");
  const targetRef = React.useRef<Frame>();

  React.useEffect(() => {
    const localPlayer = Players.LocalPlayer;
    if (!localPlayer) {
      return;
    }

    const playerGuiInstance = localPlayer.FindFirstChild("PlayerGui");
    if (!playerGuiInstance?.IsA("PlayerGui")) {
      return;
    }
    const playerGui = playerGuiInstance;

    const connection = UserInputService.InputBegan.Connect((inputObject, gameProcessedEvent) => {
      if (gameProcessedEvent || !isPointerInput(inputObject)) {
        return;
      }

      const targetFrame = targetRef.current;
      if (!targetFrame) {
        return;
      }

      const pointer = new Vector2(inputObject.Position.X, inputObject.Position.Y);
      const samples = getNormalizedPointerSamples(pointer, ignoreGuiInset);

      let isInside = false;
      for (const sample of samples) {
        const hits = playerGui.GetGuiObjectsAtPosition(sample.X, sample.Y);
        for (const hitObject of hits) {
          if (hitObject.IsDescendantOf(targetFrame)) {
            isInside = true;
            break;
          }
        }
        if (isInside) {
          break;
        }
      }

      setLastResult(
        `${isInside ? "Inside" : "Outside"} | raw=(${math.round(pointer.X)}, ${math.round(pointer.Y)}) | samples=${samples.size()}`,
      );
    });

    return () => {
      connection.Disconnect();
    };
  }, [ignoreGuiInset]);

  return (
    <frame className="w-230 h-130 bg-transparent">
      <textlabel
        Size={UDim2.fromOffset(860, 28)}
        Text="Inset Hit-Test: toggle IgnoreGuiInset and click around top bar/panel edges."
        className="text-[#dfe5ed] text-xl text-left truncate"
      />
      {ignoreGuiInset ? (
        <textbutton
          AutoButtonColor={false}
          Event={{
            Activated: () => {
              setIgnoreGuiInset(false);
            },
          }}
          Text="IgnoreGuiInset: true"
          className="top-12.5 w-62.5 h-10 bg-[#237f50] text-[#eef2f9] text-base"
        />
      ) : (
        <textbutton
          AutoButtonColor={false}
          Event={{
            Activated: () => {
              setIgnoreGuiInset(true);
            },
          }}
          Text="IgnoreGuiInset: false"
          className="top-12.5 w-62.5 h-10 bg-[#9c5430] text-[#eef2f9] text-base"
        />
      )}
      <textlabel
        Position={UDim2.fromOffset(0, 98)}
        Size={UDim2.fromOffset(860, 26)}
        Text={lastResult}
        className="text-[#bcc6d4] text-base text-left"
      />
      {/* Y position depends on the toggle, so `Position` stays a prop. */}
      <frame
        Position={UDim2.fromOffset(420, ignoreGuiInset ? 52 : 86)}
        ref={targetRef}
        className="w-80 h-45 bg-[#39264d] rounded-lg"
      >
        <textlabel
          Position={UDim2.fromOffset(16, 16)}
          Size={UDim2.fromOffset(280, 54)}
          Text="Target content area for hit-test. Click inside and outside."
          TextWrapped={true}
          className="text-[#e4dbf2] text-base text-left align-top"
        />
      </frame>
      <frame className="w-230 h-9 bg-[#782e2e]/35">
        <textlabel
          Position={UDim2.fromOffset(10, 8)}
          Size={UDim2.fromOffset(760, 20)}
          Text="Topbar-like region (inset reference)"
          className="text-[#f5e0e0] text-sm text-left"
        />
      </frame>
    </frame>
  );
}
