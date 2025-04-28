import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { usePanelStore } from "@/state/panelStore";
import { useTabStore } from "@/state/tabStore";
import { waitFor } from "@testing-library/dom";

// Mock dependencies
const nanoidMock = vi.fn();

vi.mock("nanoid", () => ({
  nanoid: () => {
    nanoidMock();
    return `mock-panel-${nanoidMock.mock.calls.length}`;
  },
}));

vi.mock("@/state/tabStore", () => ({
  useTabStore: {
    getState: vi.fn().mockReturnValue({
      addTab: vi.fn().mockReturnValue("mock-tab-1"),
      getTabsByPanelId: vi.fn().mockReturnValue([
        {
          id: "mock-tab-1",
          path: "C:\\test\\path",
          title: "test",
          isActive: true,
        },
      ]),
      closeTab: vi.fn(),
    }),
  },
}));

describe("state/panelStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePanelStore.setState({
      panels: [],
      activePanelId: "",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with empty panels", () => {
    const state = usePanelStore.getState();
    expect(state.panels).toEqual([]);
    expect(state.activePanelId).toBe("");
  });

  describe("addPanel", () => {
    it("should add a new panel", () => {
      const { addPanel } = usePanelStore.getState();
      const position = { row: 0, column: 0 };

      addPanel(position);

      const state = usePanelStore.getState();
      expect(state.panels.length).toBe(1);

      const panel = state.panels[0];
      expect(panel.id).toBe("mock-panel-1");
      expect(panel.position).toEqual(position);
      expect(panel.activeTabId).toBe("mock-tab-1");
      expect(state.activePanelId).toBe("mock-panel-1");
    });

    it("should add a panel with a custom initial directory", () => {
      const { addPanel } = usePanelStore.getState();
      const tabStore = useTabStore.getState();
      const position = { row: 1, column: 1 };
      const initialDir = "D:\\custom\\path";

      addPanel(position, initialDir);

      expect(tabStore.addTab).toHaveBeenCalledWith("mock-panel-1", initialDir);
    });

    it("should add multiple panels", () => {
      const { addPanel } = usePanelStore.getState();

      addPanel({ row: 0, column: 0 });
      addPanel({ row: 0, column: 1 });
      addPanel({ row: 1, column: 0 });

      const state = usePanelStore.getState();

      waitFor(() => {
        expect(state.panels.length).toBe(3);
        expect(state.activePanelId).toBe("mock-panel-3"); // Last added panel is active
      });
    });
  });

  describe("removePanel", () => {
    beforeEach(() => {
      // Set up test panels
      const { addPanel } = usePanelStore.getState();
      addPanel({ row: 0, column: 0 });
      addPanel({ row: 0, column: 1 });
    });

    it("should remove a panel", () => {
      const state = usePanelStore.getState();
      const panelToRemove = state.panels[0];
      const tabStore = useTabStore.getState();

      const { removePanel } = usePanelStore.getState();
      removePanel(panelToRemove.id);

      const newState = usePanelStore.getState();
      expect(newState.panels.length).toBe(1);
      expect(
        newState.panels.find((p) => p.id === panelToRemove.id)
      ).toBeUndefined();
      expect(tabStore.getTabsByPanelId).toHaveBeenCalledWith(panelToRemove.id);
      expect(tabStore.closeTab).toHaveBeenCalled();
    });

    it("should set a new active panel when removing the active panel", () => {
      const initialState = usePanelStore.getState();
      const activePanel = initialState.panels.find(
        (p) => p.id === initialState.activePanelId
      )!;
      const { removePanel } = usePanelStore.getState();

      removePanel(activePanel.id);

      const newState = usePanelStore.getState();
      expect(newState.activePanelId).not.toBe(activePanel.id);
      expect(newState.activePanelId).toBe(newState.panels[0].id);
    });

    it("should set empty active panel ID when removing the last panel", () => {
      const { removePanel } = usePanelStore.getState();
      const state = usePanelStore.getState();

      // Remove all panels
      state.panels.forEach((panel) => {
        removePanel(panel.id);
      });

      const newState = usePanelStore.getState();
      expect(newState.panels).toEqual([]);
      expect(newState.activePanelId).toBe("");
    });

    it("should handle removing a nonexistent panel", () => {
      const { removePanel } = usePanelStore.getState();

      expect(() => removePanel("nonexistent-panel")).not.toThrow();
    });
  });

  describe("setActivePanel", () => {
    beforeEach(() => {
      // Set up test panels
      const { addPanel } = usePanelStore.getState();
      addPanel({ row: 0, column: 0 });
      addPanel({ row: 0, column: 1 });
    });

    it("should set active panel", () => {
      const state = usePanelStore.getState();
      const newActivePanel = state.panels.find(
        (p) => p.id !== state.activePanelId
      )!;

      const { setActivePanel } = usePanelStore.getState();
      setActivePanel(newActivePanel.id);

      const newState = usePanelStore.getState();
      expect(newState.activePanelId).toBe(newActivePanel.id);
    });

    it("should handle setting nonexistent panel as active", () => {
      const { setActivePanel } = usePanelStore.getState();

      setActivePanel("nonexistent-panel");

      const newState = usePanelStore.getState();
      expect(newState.activePanelId).toBe("nonexistent-panel");
    });
  });

  describe("getPanelById", () => {
    beforeEach(() => {
      // Set up test panels
      const { addPanel } = usePanelStore.getState();
      addPanel({ row: 0, column: 0 });
      addPanel({ row: 0, column: 1 });
    });

    it("should get panel by ID", () => {
      const state = usePanelStore.getState();
      const targetPanel = state.panels[0];

      const { getPanelById } = usePanelStore.getState();
      const foundPanel = getPanelById(targetPanel.id);

      expect(foundPanel).toEqual(targetPanel);
    });

    it("should return undefined for nonexistent panel ID", () => {
      const { getPanelById } = usePanelStore.getState();

      const foundPanel = getPanelById("nonexistent-panel");
      expect(foundPanel).toBeUndefined();
    });
  });
});
