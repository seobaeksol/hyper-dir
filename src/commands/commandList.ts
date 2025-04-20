// src/commands/commandList.ts
import { Command } from "@/state/commandStore";
import { useUIStore } from "@/state/uiStore";
import { usePanelStore } from "@/state/panelStore";
import { getNextAvailablePosition } from "@/state/actions";

export function getDefaultCommands(): Command[] {
  const toggleSidebar = useUIStore.getState().toggleSidebar;
  const { addPanel, removePanel, setActivePanel, panels } =
    usePanelStore.getState();

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
    // Panel commands
    {
      id: "create-panel",
      title: "Create New Panel",
      action: () => {
        const position = getNextAvailablePosition();
        addPanel(position);
      },
    },
    {
      id: "close-panel",
      title: "Close Current Panel",
      action: () => {
        const activePanelId = usePanelStore.getState().activePanelId;
        if (panels.length > 1) {
          removePanel(activePanelId);
        }
      },
    },
    {
      id: "focus-panel-up",
      title: "Focus Panel Above",
      action: () => {
        const currentPanel = panels.find(
          (p) => p.id === usePanelStore.getState().activePanelId
        );
        if (!currentPanel) return;

        const targetPanel = panels.find(
          (p) =>
            p.position.column === currentPanel.position.column &&
            p.position.row === currentPanel.position.row - 1
        );

        if (targetPanel) {
          setActivePanel(targetPanel.id);
        }
      },
    },
    {
      id: "focus-panel-down",
      title: "Focus Panel Below",
      action: () => {
        const currentPanel = panels.find(
          (p) => p.id === usePanelStore.getState().activePanelId
        );
        if (!currentPanel) return;

        const targetPanel = panels.find(
          (p) =>
            p.position.column === currentPanel.position.column &&
            p.position.row === currentPanel.position.row + 1
        );

        if (targetPanel) {
          setActivePanel(targetPanel.id);
        }
      },
    },
    {
      id: "focus-panel-left",
      title: "Focus Panel Left",
      action: () => {
        const currentPanel = panels.find(
          (p) => p.id === usePanelStore.getState().activePanelId
        );
        if (!currentPanel) return;

        const targetPanel = panels.find(
          (p) =>
            p.position.row === currentPanel.position.row &&
            p.position.column === currentPanel.position.column - 1
        );

        if (targetPanel) {
          setActivePanel(targetPanel.id);
        }
      },
    },
    {
      id: "focus-panel-right",
      title: "Focus Panel Right",
      action: () => {
        const currentPanel = panels.find(
          (p) => p.id === usePanelStore.getState().activePanelId
        );
        if (!currentPanel) return;

        const targetPanel = panels.find(
          (p) =>
            p.position.row === currentPanel.position.row &&
            p.position.column === currentPanel.position.column + 1
        );

        if (targetPanel) {
          setActivePanel(targetPanel.id);
        }
      },
    },
  ];
}
