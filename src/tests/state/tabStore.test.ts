import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useTabStore, Tab } from "@/state/tabStore";

// Mock nanoid to have predictable IDs
const nanoidMock = vi.fn();
vi.mock("nanoid", () => ({
  nanoid: () => {
    nanoidMock();
    return `mock-tab-${nanoidMock.mock.calls.length}`;
  },
}));

describe("state/tabStore", () => {
  const panelId = "panel-1";

  beforeEach(() => {
    vi.clearAllMocks();
    useTabStore.setState({ tabs: {} });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with empty tabs", () => {
    const state = useTabStore.getState();
    expect(state.tabs).toEqual({});
  });

  describe("addTab", () => {
    it("should add a new tab to an empty panel", () => {
      const { addTab } = useTabStore.getState();
      const path = "C:\\test\\path";

      const tabId = addTab(panelId, path);

      const state = useTabStore.getState();
      expect(tabId).toBe("mock-tab-1");
      expect(state.tabs[panelId]).toBeDefined();
      expect(state.tabs[panelId].length).toBe(1);

      const tab = state.tabs[panelId][0];
      expect(tab.id).toBe(tabId);
      expect(tab.path).toBe(path);
      expect(tab.title).toBe("path");
      expect(tab.isActive).toBe(true);
    });

    it("should add a new tab and deactivate existing tabs", () => {
      const { addTab } = useTabStore.getState();

      // Add first tab
      const tabId1 = addTab(panelId, "C:\\test\\path1");

      // Add second tab
      const tabId2 = addTab(panelId, "C:\\test\\path2");

      const state = useTabStore.getState();
      expect(state.tabs[panelId].length).toBe(2);

      const tab1 = state.tabs[panelId].find((t) => t.id === tabId1);
      const tab2 = state.tabs[panelId].find((t) => t.id === tabId2);

      expect(tab1?.isActive).toBe(false);
      expect(tab2?.isActive).toBe(true);
    });

    it("should use default path if not provided", () => {
      const { addTab } = useTabStore.getState();

      addTab(panelId, "");

      const state = useTabStore.getState();
      const tab = state.tabs[panelId][0];

      expect(tab.path).toBe("C:\\");
      expect(tab.title).toBe("C:\\");
    });
  });

  describe("closeTab", () => {
    let tabs: Tab[];

    beforeEach(() => {
      // Set up test tabs
      const { addTab } = useTabStore.getState();
      addTab(panelId, "C:\\test\\path1");
      addTab(panelId, "C:\\test\\path2");
      addTab(panelId, "C:\\test\\path3");

      tabs = [...useTabStore.getState().tabs[panelId]];
    });

    it("should close a tab", () => {
      const { closeTab } = useTabStore.getState();
      const tabToClose = tabs[1];

      closeTab(panelId, tabToClose.id);

      const state = useTabStore.getState();
      expect(state.tabs[panelId].length).toBe(2);
      expect(
        state.tabs[panelId].find((t) => t.id === tabToClose.id)
      ).toBeUndefined();
    });

    it("should activate previous tab when closing active tab", () => {
      const { closeTab } = useTabStore.getState();
      const activeTab = tabs.find((t) => t.isActive)!;

      closeTab(panelId, activeTab.id);

      const state = useTabStore.getState();
      // The previous tab should be active
      const previousTabIndex = tabs.findIndex((t) => t.id === activeTab.id) - 1;
      const previousTab = tabs[previousTabIndex >= 0 ? previousTabIndex : 0];

      const newActiveTab = state.tabs[panelId].find((t) => t.isActive);
      expect(newActiveTab?.id).toBe(previousTab.id);
    });

    it("should handle closing last tab", () => {
      const { closeTab } = useTabStore.getState();

      // Close all tabs one by one
      closeTab(panelId, tabs[2].id);
      closeTab(panelId, tabs[1].id);
      closeTab(panelId, tabs[0].id);

      const state = useTabStore.getState();
      expect(state.tabs[panelId]).toEqual([]);
    });

    it("should handle closing nonexistent tab", () => {
      const { closeTab } = useTabStore.getState();

      expect(() => closeTab(panelId, "nonexistent-tab")).not.toThrow();

      const state = useTabStore.getState();
      expect(state.tabs[panelId].length).toBe(3);
    });
  });

  describe("switchTab", () => {
    let tabs: Tab[];

    beforeEach(() => {
      // Set up test tabs
      const { addTab } = useTabStore.getState();
      addTab(panelId, "C:\\test\\path1");
      addTab(panelId, "C:\\test\\path2");
      addTab(panelId, "C:\\test\\path3");

      tabs = [...useTabStore.getState().tabs[panelId]];
    });

    it("should switch to a different tab", () => {
      const { switchTab } = useTabStore.getState();
      const tabToActivate = tabs.find((t) => !t.isActive)!;

      switchTab(panelId, tabToActivate.id);

      const state = useTabStore.getState();
      const activeTab = state.tabs[panelId].find((t) => t.isActive);
      expect(activeTab?.id).toBe(tabToActivate.id);
    });

    it("should deactivate other tabs when switching", () => {
      const { switchTab } = useTabStore.getState();
      const tabToActivate = tabs.find((t) => !t.isActive)!;

      switchTab(panelId, tabToActivate.id);

      const state = useTabStore.getState();
      state.tabs[panelId].forEach((tab) => {
        if (tab.id === tabToActivate.id) {
          expect(tab.isActive).toBe(true);
        } else {
          expect(tab.isActive).toBe(false);
        }
      });
    });
  });

  describe("updateTab", () => {
    let tabs: Tab[];

    beforeEach(() => {
      // Set up test tabs
      const { addTab } = useTabStore.getState();
      addTab(panelId, "C:\\test\\path1");

      tabs = [...useTabStore.getState().tabs[panelId]];
    });

    it("should update tab title", () => {
      const { updateTab } = useTabStore.getState();
      const tabToUpdate = tabs[0];

      updateTab(panelId, tabToUpdate.id, "New Title");

      const state = useTabStore.getState();
      const updatedTab = state.tabs[panelId].find(
        (t) => t.id === tabToUpdate.id
      );
      expect(updatedTab?.title).toBe("New Title");
      expect(updatedTab?.path).toBe(tabToUpdate.path); // Path unchanged
    });

    it("should update tab path", () => {
      const { updateTab } = useTabStore.getState();
      const tabToUpdate = tabs[0];

      updateTab(panelId, tabToUpdate.id, undefined, "C:\\new\\path");

      const state = useTabStore.getState();
      const updatedTab = state.tabs[panelId].find(
        (t) => t.id === tabToUpdate.id
      );
      expect(updatedTab?.path).toBe("C:\\new\\path");
      expect(updatedTab?.title).toBe(tabToUpdate.title); // Title unchanged
    });

    it("should update both title and path", () => {
      const { updateTab } = useTabStore.getState();
      const tabToUpdate = tabs[0];

      updateTab(panelId, tabToUpdate.id, "New Title", "C:\\new\\path");

      const state = useTabStore.getState();
      const updatedTab = state.tabs[panelId].find(
        (t) => t.id === tabToUpdate.id
      );
      expect(updatedTab?.title).toBe("New Title");
      expect(updatedTab?.path).toBe("C:\\new\\path");
    });

    it("should handle updating nonexistent tab", () => {
      const { updateTab } = useTabStore.getState();

      expect(() =>
        updateTab(panelId, "nonexistent-tab", "New Title")
      ).not.toThrow();
    });
  });

  describe("getter functions", () => {
    let tabs: Tab[];

    beforeEach(() => {
      // Set up test tabs
      const { addTab } = useTabStore.getState();
      addTab(panelId, "C:\\test\\path1");
      addTab(panelId, "C:\\test\\path2");
      addTab(panelId, "C:\\test\\path3");

      tabs = [...useTabStore.getState().tabs[panelId]];
    });

    it("should get tabs by panel ID", () => {
      const { getTabsByPanelId } = useTabStore.getState();

      const panelTabs = getTabsByPanelId(panelId);
      expect(panelTabs).toEqual(tabs);

      const emptyPanelTabs = getTabsByPanelId("nonexistent-panel");
      expect(emptyPanelTabs).toEqual([]);
    });

    it("should get active tab", () => {
      const { getActiveTab } = useTabStore.getState();

      const activeTab = getActiveTab(panelId);
      const expectedActiveTab = tabs.find((t) => t.isActive);
      expect(activeTab).toEqual(expectedActiveTab);

      const noActiveTab = getActiveTab("nonexistent-panel");
      expect(noActiveTab).toBeUndefined();
    });

    it("should get tab by ID", () => {
      const { getTabById } = useTabStore.getState();
      const targetTab = tabs[1];

      const foundTab = getTabById(panelId, targetTab.id);
      expect(foundTab).toEqual(targetTab);

      const notFoundTab = getTabById(panelId, "nonexistent-tab");
      expect(notFoundTab).toBeUndefined();
    });
  });

  describe("updateTabAddressBarRef", () => {
    let tabs: Tab[];
    const panelId = "panel-1";

    beforeEach(() => {
      useTabStore.setState({ tabs: {} });
      const { addTab } = useTabStore.getState();
      addTab(panelId, "C:\\test\\path1");
      tabs = [...useTabStore.getState().tabs[panelId]];
    });

    it("should update the addressBarRef of a tab", () => {
      const { updateTabAddressBarRef } = useTabStore.getState();
      const tabToUpdate = tabs[0];
      const refObj = { current: document.createElement("span") };

      updateTabAddressBarRef(panelId, tabToUpdate.id, refObj);

      const updatedTab = useTabStore
        .getState()
        .tabs[panelId].find((t) => t.id === tabToUpdate.id);

      expect(updatedTab?.addressBarRef).toBe(refObj);
    });

    it("should not throw if tab does not exist", () => {
      const { updateTabAddressBarRef } = useTabStore.getState();
      const refObj = { current: document.createElement("span") };

      expect(() =>
        updateTabAddressBarRef(panelId, "nonexistent-tab", refObj)
      ).not.toThrow();
    });
  });

  describe("closeTab edge cases", () => {
    const panelId = "panel-1";

    beforeEach(() => {
      useTabStore.setState({ tabs: {} });
    });

    it("should not throw if closing tab on empty panel", () => {
      const { closeTab } = useTabStore.getState();
      expect(() => closeTab(panelId, "any-tab-id")).not.toThrow();
      expect(useTabStore.getState().tabs[panelId]).toHaveLength(0);
    });
  });
});
