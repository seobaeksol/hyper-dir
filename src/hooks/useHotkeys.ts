// src/hooks/useHotkeys.ts
import { useEffect } from "react";
import { useSidebarController } from "./useSidebarController";
import { useCommandStore } from "@/state/commandStore";
import { usePanelStore } from "@/state/panelStore";
import {
  getNextAvailablePosition,
  addRowPanel,
  addColumnPanel,
} from "@/state/actions";

export function useHotkeys() {
  const left = useSidebarController("left");
  const right = useSidebarController("right");
  const toggleCommandPalette = useCommandStore((s) => s.toggleCommandPalette);
  const { addPanel, removePanel, setActivePanel, panels } = usePanelStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      const isAlt = e.altKey;
      const isShift = e.shiftKey;

      // Sidebar shortcuts
      if (isCtrl && !isAlt && e.key.toLowerCase() === "b") {
        e.preventDefault();
        right.toggle();
      }

      if (isCtrl && isAlt && e.key.toLowerCase() === "b") {
        e.preventDefault();
        left.toggle();
      }

      // Command Palette shortcuts
      if (isCtrl && !isShift && e.key.toLowerCase() === "p") {
        e.preventDefault();
        toggleCommandPalette("search");
      }

      if (isCtrl && isShift && e.key.toLowerCase() === "p") {
        e.preventDefault();
        toggleCommandPalette("command");
      }

      // Panel shortcuts
      if (isCtrl && isAlt && e.key === "\\") {
        e.preventDefault();
        const position = getNextAvailablePosition();
        addPanel(position);
      }

      // New panel row shortcut (Ctrl+Alt+Down)
      if (isCtrl && isAlt && e.key === "ArrowDown" && isShift) {
        e.preventDefault();
        addRowPanel();
      }

      // New panel column shortcut (Ctrl+Alt+Right)
      if (isCtrl && isAlt && e.key === "ArrowRight" && isShift) {
        e.preventDefault();
        addColumnPanel();
      }

      if (isCtrl && isAlt && e.key.toLowerCase() === "q") {
        e.preventDefault();
        const activePanelId = usePanelStore.getState().activePanelId;
        if (panels.length > 1) {
          removePanel(activePanelId);
        }
      }

      // Panel navigation (without Shift)
      if (isCtrl && isAlt && !isShift) {
        const currentPanel = panels.find(
          (p) => p.id === usePanelStore.getState().activePanelId
        );
        if (!currentPanel) return;

        let targetPanel;
        switch (e.key) {
          case "ArrowUp":
            targetPanel = panels.find(
              (p) =>
                p.position.column === currentPanel.position.column &&
                p.position.row === currentPanel.position.row - 1
            );
            break;
          case "ArrowDown":
            targetPanel = panels.find(
              (p) =>
                p.position.column === currentPanel.position.column &&
                p.position.row === currentPanel.position.row + 1
            );
            break;
          case "ArrowLeft":
            targetPanel = panels.find(
              (p) =>
                p.position.row === currentPanel.position.row &&
                p.position.column === currentPanel.position.column - 1
            );
            break;
          case "ArrowRight":
            targetPanel = panels.find(
              (p) =>
                p.position.row === currentPanel.position.row &&
                p.position.column === currentPanel.position.column + 1
            );
            break;
        }

        if (targetPanel) {
          e.preventDefault();
          setActivePanel(targetPanel.id);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
