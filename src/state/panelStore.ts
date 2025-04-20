import { create } from "zustand";
import { nanoid } from "nanoid";
import { useTabStore } from "./tabStore";

type Panel = {
  id: string;
  activeTabId: string;
};

type PanelStore = {
  panels: Panel[];
  activePanelId: string;

  addPanel: () => void;
  removePanel: (id: string) => void;
  switchPanel: (id: string) => void;
};

export const usePanelStore = create<PanelStore>((set, get) => ({
  panels: [],
  activePanelId: "",

  addPanel: () => {
    const panelId = nanoid();
    const home = "C:\\"; // TODO: Configure default directory by platform

    const tabStore = useTabStore.getState();
    const tabId = tabStore.addTab(panelId, home);

    const newPanel: Panel = {
      id: panelId,
      activeTabId: tabId,
    };

    set((state) => ({
      panels: [...state.panels, newPanel],
      activePanelId: panelId,
    }));
  },

  removePanel: (id) => {
    const tabStore = useTabStore.getState();
    const panel = get().panels.find((p) => p.id === id);

    if (panel) {
      // Remove all tabs associated with this panel
      const panelTabs = tabStore.getTabsByPanelId(id);
      panelTabs.forEach((tab) => tabStore.closeTab(id, tab.id));
    }

    set((state) => {
      const filtered = state.panels.filter((p) => p.id !== id);
      const newActiveId = filtered[0]?.id || "";
      return { panels: filtered, activePanelId: newActiveId };
    });
  },

  switchPanel: (id) => set({ activePanelId: id }),
}));
