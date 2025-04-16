// src/state/uiStore.ts
import { create } from "zustand";

type Panel = "left" | "right";

interface UIState {
  sidebarVisible: boolean;
  rightSidebarVisible: boolean;
  commandPaletteVisible: boolean;
  focusedPanel: Panel;
  setSidebarVisible: (visible: boolean) => void;
  toggleCommandPalette: () => void;
  setFocusedPanel: (panel: Panel) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarVisible: true,
  rightSidebarVisible: false,
  commandPaletteVisible: false,
  focusedPanel: "left",
  setSidebarVisible: (visible) => set({ sidebarVisible: visible }),
  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteVisible: !state.commandPaletteVisible })),
  setFocusedPanel: (panel) => set({ focusedPanel: panel }),
}));
