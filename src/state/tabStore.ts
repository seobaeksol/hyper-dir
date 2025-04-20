import { create } from "zustand";
import { nanoid } from "nanoid";

export type Tab = {
  id: string;
  path: string;
  title: string;
  isActive: boolean;
};

type TabStore = {
  tabs: Record<string, Tab[]>; // panelId -> tabs

  addTab: (panelId: string, path: string) => string;
  closeTab: (panelId: string, tabId: string) => void;
  switchTab: (panelId: string, tabId: string) => void;
  updateTab: (
    panelId: string,
    tabId: string,
    title?: string,
    path?: string
  ) => void;
  getTabsByPanelId: (panelId: string) => Tab[];
  getActiveTab: (panelId: string) => Tab | undefined;
  getTabById: (panelId: string, tabId: string) => Tab | undefined;
};

export const useTabStore = create<TabStore>((set, get) => ({
  tabs: {},

  addTab: (panelId, path) => {
    if (!path) {
      path = "C:\\"; // TODO: Configure default directory by platform
    }

    const tabId = nanoid();
    const title = path.split(/[/\\]/).pop() || path;
    const newTab: Tab = { id: tabId, path, title, isActive: true };

    set((state) => ({
      tabs: {
        ...state.tabs,
        [panelId]: [
          ...(state.tabs[panelId] || []).map((t) => ({
            ...t,
            isActive: false,
          })),
          newTab,
        ],
      },
    }));

    return tabId;
  },

  closeTab: (panelId, tabId) => {
    set((state) => {
      const panelTabs = state.tabs[panelId] || [];
      const newTabs = panelTabs.filter((t) => t.id !== tabId);
      const closedTabIndex = panelTabs.findIndex((t) => t.id === tabId);

      const newActive =
        closedTabIndex > 0 ? panelTabs[closedTabIndex - 1].id : newTabs[0]?.id;

      return {
        tabs: {
          ...state.tabs,
          [panelId]: newTabs.map((t) => ({
            ...t,
            isActive: t.id === newActive,
          })),
        },
      };
    });
  },

  switchTab: (panelId, tabId) => {
    set((state) => ({
      tabs: {
        ...state.tabs,
        [panelId]: (state.tabs[panelId] || []).map((t) => ({
          ...t,
          isActive: t.id === tabId,
        })),
      },
    }));
  },

  updateTab: (panelId, tabId, title, path) => {
    set((state) => ({
      tabs: {
        ...state.tabs,
        [panelId]: (state.tabs[panelId] || []).map((t) =>
          t.id === tabId
            ? {
                ...t,
                title: title ?? t.title,
                path: path ?? t.path,
              }
            : t
        ),
      },
    }));
  },

  getTabsByPanelId: (panelId) => {
    return get().tabs[panelId] || [];
  },

  getActiveTab: (panelId) => {
    return get().tabs[panelId]?.find((t) => t.isActive);
  },

  getTabById: (panelId, tabId) => {
    return get().tabs[panelId]?.find((t) => t.id === tabId);
  },
}));
