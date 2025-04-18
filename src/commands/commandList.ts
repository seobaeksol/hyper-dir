// src/commands/commandList.ts
import { Command } from "@/state/commandStore";
import { useUIStore } from "@/state/uiStore";

export function getDefaultCommands(): Command[] {
  const toggleSidebar = useUIStore.getState().toggleSidebar;

  return [
    {
      id: "open-folder",
      title: "Open Folder",
      action: () => console.log("Open folder clicked"),
    },
    {
      id: "toggle-left-sidebar",
      title: "Toggle Left Sidebar",
      action: () => toggleSidebar("left"),
    },
    {
      id: "toggle-right-sidebar",
      title: "Toggle Right Sidebar",
      action: () => toggleSidebar("right"),
    },
  ];
}
