// src/components/layout/panel/usePanelKeyboardNav.ts
import { useEffect } from "react";
import { useFileStore } from "@/state/fileStore";
import { useUIStore } from "@/state/uiStore";
import { usePanelStore } from "@/state/panelStore";
import { moveDirectory } from "@/state/actions";

export function usePanelKeyboardNav(panelId: string) {
  const { getCurrentFileState, setFileState } = useFileStore();
  const commandPaletteVisible = useUIStore((s) => s.commandPaletteVisible);
  const { panels, activePanelId } = usePanelStore();
  const panel = panels.find((p) => p.id === panelId);

  useEffect(() => {
    if (commandPaletteVisible || !panel || panel.id !== activePanelId) return;

    const fileState = getCurrentFileState(panelId, panel.activeTabId);
    const { files, selectedIndex } = fileState;

    const panelKeyEventHandler = (e: KeyboardEvent) => {
      const isAlt = e.altKey;

      if (!isAlt && e.key === "ArrowUp") {
        e.preventDefault();
        if (files.length > 0) {
          setFileState(panelId, panel.activeTabId, {
            selectedIndex: (selectedIndex - 1 + files.length) % files.length,
          });
        }
      }

      if (!isAlt && e.key === "ArrowDown") {
        e.preventDefault();
        if (files.length > 0) {
          setFileState(panelId, panel.activeTabId, {
            selectedIndex: (selectedIndex + 1) % files.length,
          });
        }
      }

      if (!isAlt && e.key === "Enter") {
        e.preventDefault();
        const target = files[selectedIndex];
        if (target?.is_dir) {
          moveDirectory(panel.activeTabId, target.path);
        }
      }

      if (!isAlt && e.key === "Backspace") {
        e.preventDefault();
        const parent = files.find((f) => f.name === "..");
        if (parent) {
          moveDirectory(panel.activeTabId, parent.path);
        }
      }

      if (!isAlt && e.key === "Escape") {
        e.preventDefault();
        setFileState(panelId, panel.activeTabId, { selectedIndex: -1 });
      }

      if (isAlt && e.key === "ArrowUp") {
        e.preventDefault();
        const parent = files.find((f) => f.name === "..");
        if (parent) {
          moveDirectory(panel.activeTabId, parent.path);
        }
      }

      if (isAlt && e.key === "ArrowDown") {
        e.preventDefault();
        const target = files[selectedIndex];
        if (target?.is_dir) {
          moveDirectory(panel.activeTabId, target.path);
        }
      }
    };

    window.addEventListener("keydown", panelKeyEventHandler);
    return () => window.removeEventListener("keydown", panelKeyEventHandler);
  }, [commandPaletteVisible, panel, activePanelId]);
}
