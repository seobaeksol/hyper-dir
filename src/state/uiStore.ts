// src/state/uiStore.ts
import { create } from "zustand";

type Panel = "left" | "right";
type SidebarPosition = "left" | "right";

interface SidebarState {
  display: boolean;
  width?: number;
  pinned?: boolean;
  collapsed?: boolean;
  activeTabId?: string;
}

interface UIState {
  sidebar: Record<SidebarPosition, SidebarState>;
  commandPaletteVisible: boolean;
  focusedPanel: Panel;
  setSidebarVisible: (side: SidebarPosition, visible: boolean) => void;
  toggleSidebar: (side: SidebarPosition) => void;
  setFocusedPanel: (panel: Panel) => void;
  toggleCommandPalette: () => void;
  setActiveTab: (side: SidebarPosition, tabId: string) => void;
  setCommandPaletteVisible: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set, _) => ({
  sidebar: {
    left: { display: false, activeTabId: "explorer" },
    right: { display: false, activeTabId: "config" },
  },
  commandPaletteVisible: false,
  focusedPanel: "left",
  setSidebarVisible: (side, visible) =>
    set((state) => ({
      sidebar: {
        ...state.sidebar,
        [side]: {
          ...state.sidebar[side],
          display: visible,
        },
      },
    })),
  toggleSidebar: (side) =>
    set((state) => ({
      sidebar: {
        ...state.sidebar,
        [side]: {
          ...state.sidebar[side],
          display: !state.sidebar[side].display,
        },
      },
    })),
  toggleCommandPalette: () =>
    set((state) => ({
      commandPaletteVisible: !state.commandPaletteVisible,
    })),
  setFocusedPanel: (panel) => set({ focusedPanel: panel }),
  setActiveTab: (side, tabId) =>
    set((state) => ({
      sidebar: {
        ...state.sidebar,
        [side]: { ...state.sidebar[side], activeTabId: tabId },
      },
    })),
  setCommandPaletteVisible: (v: boolean) => set({ commandPaletteVisible: v }),
}));
