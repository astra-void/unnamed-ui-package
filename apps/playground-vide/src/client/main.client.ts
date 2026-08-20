import { Vide } from "@lattice-ui/vide-runtime";
import { PlaygroundWorkspace } from "./PlaygroundWorkspace";

const Players = game.GetService("Players");
const StarterGui = game.GetService("StarterGui");

const localPlayer = Players.LocalPlayer;
if (!localPlayer) {
  error("LocalPlayer is required for the Vide playground.");
}

// Declutter the demo surface: the default player list and chat overlap the header controls.
pcall(() => {
  StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.PlayerList, false);
  StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Chat, false);
});

const playerGuiInstance = localPlayer.WaitForChild("PlayerGui");
if (!playerGuiInstance.IsA("PlayerGui")) {
  error("PlayerGui instance is required for the Vide playground.");
}

const playerGui = playerGuiInstance;
const rootContainer = new Instance("Folder");
rootContainer.Name = "LatticeVidePlaygroundRoot";
rootContainer.Parent = playerGui;

// Vide's stable scope replaces React's root: one mount owns every effect the tree creates, and
// destroying it is what tears the playground down.
Vide.mount(() => PlaygroundWorkspace({ playerGui }), rootContainer);
