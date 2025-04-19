import { create } from "zustand";
import { nanoid } from "nanoid";

type Tab = {
  id: string;
  path: string;
  title: string;
  isActive: boolean;
};

type Panel = {
  id: string;
  tabs: Tab[];
  activeTabId: string;
};

type PanelStore = {
  panels: Panel[];
  activePanelId: string;

  addPanel: () => void;
  removePanel: (id: string) => void;
  switchPanel: (id: string) => void;

  addTab: (panelId: string, path: string) => string;
  closeTab: (panelId: string, tabId: string) => void;
  switchTab: (panelId: string, tabId: string) => void;
  updateTab: (
    panelId: string,
    tabId: string,
    title?: string,
    path?: string
  ) => void;
};

export const usePanelStore = create<PanelStore>((set, get) => ({
  panels: [],
  activePanelId: "",

  addPanel: () => {
    const panelId = nanoid();
    const home = "C:\\"; // TODO: Configure default directory by platform
    const tabId = nanoid();
    const title = home.split(/[/\\]/).pop() || home;

    const newPanel: Panel = {
      id: panelId,
      activeTabId: tabId,
      tabs: [{ id: tabId, path: home, title, isActive: true }],
    };

    set((state) => ({
      panels: [...state.panels, newPanel],
      activePanelId: panelId,
    }));
  },

  removePanel: (id) => {
    set((state) => {
      const filtered = state.panels.filter((p) => p.id !== id);
      const newActiveId = filtered[0]?.id || "";
      return { panels: filtered, activePanelId: newActiveId };
    });
  },

  switchPanel: (id) => set({ activePanelId: id }),

  addTab: (panelId, path) => {
    const panel = get().panels.find((p) => p.id === panelId);
    if (!panel) return "";

    if (!path) {
      path = "C:\\"; // TODO: Configure default directory by platform
    }

    const tabId = nanoid();
    const title = path.split(/[/\\]/).pop() || path;
    const newTab: Tab = { id: tabId, path, title, isActive: true };

    set((state) => ({
      panels: state.panels.map((p) =>
        p.id === panelId
          ? {
              ...p,
              tabs: p.tabs
                .map((t) => ({ ...t, isActive: false }))
                .concat(newTab),
              activeTabId: tabId,
            }
          : p
      ),
    }));

    return tabId;
  },

  closeTab: (panelId, tabId) => {
    set((state) => ({
      panels: state.panels.map((p) => {
        if (p.id !== panelId) return p;
        const newTabs = p.tabs.filter((t) => t.id !== tabId);
        const closedTabIndex = p.tabs.findIndex((t) => t.id === tabId);
        const newActive =
          closedTabIndex > 0
            ? p.tabs[closedTabIndex - 1].id
            : newTabs[0]?.id || "";
        return {
          ...p,
          tabs: newTabs.map((t) => ({ ...t, isActive: t.id === newActive })),
          activeTabId: newActive,
        };
      }),
    }));
  },

  switchTab: (panelId, tabId) => {
    set((state) => ({
      panels: state.panels.map((p) =>
        p.id === panelId
          ? {
              ...p,
              tabs: p.tabs.map((t) => ({ ...t, isActive: t.id === tabId })),
              activeTabId: tabId,
            }
          : p
      ),
    }));
  },

  updateTab: (panelId, tabId, title, path) => {
    set((state) => ({
      panels: state.panels.map((p) =>
        p.id === panelId
          ? {
              ...p,
              tabs: p.tabs.map((t) =>
                t.id === tabId
                  ? {
                      ...t,
                      title: title ? title : t.title,
                      path: path ? path : t.path,
                    }
                  : t
              ),
            }
          : p
      ),
    }));
  },
}));
