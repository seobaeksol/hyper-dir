// src/state/tabStore.ts
import { create } from "zustand";

export interface Tab {
  id: string;
  path: string;
}

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (tab: Tab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
}

export const useTabStore = create<TabState>((set) => ({
  tabs: [],
  activeTabId: null,
  addTab: (tab) =>
    set((state) => ({
      tabs: [...state.tabs, tab],
      activeTabId: tab.id,
    })),
  closeTab: (id) =>
    set((state) => {
      const newTabs = state.tabs.filter((t) => t.id !== id);
      const isClosingActive = state.activeTabId === id;
      return {
        tabs: newTabs,
        activeTabId: isClosingActive ? newTabs[0]?.id ?? null : state.activeTabId,
      };
    }),
  setActiveTab: (id) => set({ activeTabId: id }),
}));
