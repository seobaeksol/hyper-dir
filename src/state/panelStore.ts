import { create } from "zustand";
import { nanoid } from "nanoid";
import { useTabStore } from "./tabStore";

interface Panel { 
  id: string;
  activeTabId: string;
  position: {
    row: number;
    column: number;
  };
};

interface PanelStore { 
  panels: Panel[];
  activePanelId: string;

  addPanel: (
    position: { row: number; column: number },
    initialDir?: string
  ) => void;
  removePanel: (id: string) => void;
  setActivePanel: (id: string) => void;
  getPanelById: (id: string) => Panel | undefined;
};

export const usePanelStore = create<PanelStore>((set, get) => ({
  panels: [],
  activePanelId: "",

  addPanel: (position, initialDir = "C:\\") => {
    const panelId = nanoid();
    const tabStore = useTabStore.getState();
    const tabId = tabStore.addTab(panelId, initialDir);

    const newPanel: Panel = {
      id: panelId,
      activeTabId: tabId,
      position,
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

  setActivePanel: (id) => set({ activePanelId: id }),

  getPanelById: (id) => get().panels.find((p) => p.id === id),
}));
