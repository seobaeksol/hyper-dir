import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as actions from "@/state/actions";
import { usePanelStore } from "@/state/panelStore";
import { useFileStore } from "@/state/fileStore";
import { useTabStore } from "@/state/tabStore";
import { registerDefaultCommands } from "@/commands/registerDefaultCommands";

// Mock dependencies
vi.mock("@/state/panelStore", () => ({
  usePanelStore: {
    getState: vi.fn(),
  },
}));

vi.mock("@/state/fileStore", () => ({
  useFileStore: {
    getState: vi.fn(),
  },
}));

vi.mock("@/state/tabStore", () => ({
  useTabStore: {
    getState: vi.fn(),
  },
}));

vi.mock("@/commands/registerDefaultCommands", () => ({
  registerDefaultCommands: vi.fn(),
}));

describe("state/actions", () => {
  // Common mock setup
  const mockPanelStore = {
    panels: [
      { id: "panel1", position: { row: 0, column: 0 } },
      { id: "panel2", position: { row: 0, column: 1 } },
    ],
    activePanelId: "panel1",
    addPanel: vi.fn(),
    removePanel: vi.fn(),
    setActivePanel: vi.fn(),
    getPanelById: vi.fn(),
  };

  const mockFileStore = {
    loadDirectory: vi.fn(),
    setFileState: vi.fn(),
    setSortKey: vi.fn(),
    setSortOrder: vi.fn(),
  };

  const mockTabStore = {
    addTab: vi.fn().mockReturnValue("new-tab-id"),
    updateTab: vi.fn(),
    closeTab: vi.fn(),
    switchTab: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    (usePanelStore.getState as any).mockReturnValue(mockPanelStore);
    (useFileStore.getState as any).mockReturnValue(mockFileStore);
    (useTabStore.getState as any).mockReturnValue(mockTabStore);
  });

  afterEach(() => {});

  describe("getNextAvailablePosition", () => {
    it("should return (0,0) for an empty panel list", () => {
      (usePanelStore.getState as any).mockReturnValue({
        panels: [],
      });

      const position = actions.getNextAvailablePosition();

      expect(position).toEqual({ row: 0, column: 0 });
    });

    it("should complete a square when needed", () => {
      // Mock existing panel positions forming an incomplete square
      const mockPanels = [
        { position: { row: 0, column: 0 } },
        { position: { row: 0, column: 1 } },
        { position: { row: 1, column: 0 } },
      ];

      (usePanelStore.getState as any).mockReturnValue({
        panels: mockPanels,
      });

      const position = actions.getNextAvailablePosition();

      // Should complete the square at row 1, column 1
      expect(position).toEqual({ row: 1, column: 1 });
    });

    it("should add a new column for a square layout", () => {
      // Mock existing panel positions forming a square
      const mockPanels = [
        { position: { row: 0, column: 0 } },
        { position: { row: 0, column: 1 } },
        { position: { row: 1, column: 0 } },
        { position: { row: 1, column: 1 } },
      ];

      (usePanelStore.getState as any).mockReturnValue({
        panels: mockPanels,
      });

      const position = actions.getNextAvailablePosition();

      // Should add a new column at row 0, column 2
      expect(position).toEqual({ row: 0, column: 2 });
    });

    it("should fill gaps in the grid before extending", () => {
      // Mock existing panel positions with a gap
      const mockPanels = [
        { position: { row: 0, column: 0 } },
        { position: { row: 0, column: 2 } },
        { position: { row: 1, column: 0 } },
        { position: { row: 1, column: 1 } },
      ];

      (usePanelStore.getState as any).mockReturnValue({
        panels: mockPanels,
      });

      const position = actions.getNextAvailablePosition();

      // Should fill the gap at row 0, column 1
      expect(position).toEqual({ row: 0, column: 1 });
    });
  });

  describe("addRowPanel", () => {
    it("should add a panel below the active panel", () => {
      const mockActivePanelId = "panel1";
      const mockPanels = [{ id: "panel1", position: { row: 0, column: 0 } }];

      const mockPanelStore = {
        panels: mockPanels,
        activePanelId: mockActivePanelId,
        addPanel: vi.fn(),
      };

      (usePanelStore.getState as any).mockReturnValue(mockPanelStore);

      actions.addRowPanel();

      expect(mockPanelStore.addPanel).toHaveBeenCalledWith({
        row: 1,
        column: 0,
      });
    });

    it("should not add a panel if one already exists at the target position", () => {
      const mockActivePanelId = "panel1";
      const mockPanels = [
        { id: "panel1", position: { row: 0, column: 0 } },
        { id: "panel2", position: { row: 1, column: 0 } },
      ];

      const mockPanelStore = {
        panels: mockPanels,
        activePanelId: mockActivePanelId,
        addPanel: vi.fn(),
      };

      (usePanelStore.getState as any).mockReturnValue(mockPanelStore);

      actions.addRowPanel();

      expect(mockPanelStore.addPanel).not.toHaveBeenCalled();
    });

    it("should create a first panel if none exists", () => {
      const mockPanelStore = {
        panels: [],
        activePanelId: "",
        addPanel: vi.fn(),
      };

      (usePanelStore.getState as any).mockReturnValue(mockPanelStore);

      actions.addRowPanel();

      expect(mockPanelStore.addPanel).toHaveBeenCalledWith({
        row: 0,
        column: 0,
      });
    });
  });

  describe("addColumnPanel", () => {
    it("should add a panel to the right of the active panel", () => {
      const mockActivePanelId = "panel1";
      const mockPanels = [{ id: "panel1", position: { row: 0, column: 0 } }];

      const mockPanelStore = {
        panels: mockPanels,
        activePanelId: mockActivePanelId,
        addPanel: vi.fn(),
      };

      (usePanelStore.getState as any).mockReturnValue(mockPanelStore);

      actions.addColumnPanel();

      expect(mockPanelStore.addPanel).toHaveBeenCalledWith({
        row: 0,
        column: 1,
      });
    });

    it("should not add a panel if one already exists at the target position", () => {
      const mockActivePanelId = "panel1";
      const mockPanels = [
        { id: "panel1", position: { row: 0, column: 0 } },
        { id: "panel2", position: { row: 0, column: 1 } },
      ];

      const mockPanelStore = {
        panels: mockPanels,
        activePanelId: mockActivePanelId,
        addPanel: vi.fn(),
      };

      (usePanelStore.getState as any).mockReturnValue(mockPanelStore);

      actions.addColumnPanel();

      expect(mockPanelStore.addPanel).not.toHaveBeenCalled();
    });

    it("should create a first panel if none exists", () => {
      const mockPanelStore = {
        panels: [],
        activePanelId: "",
        addPanel: vi.fn(),
      };

      (usePanelStore.getState as any).mockReturnValue(mockPanelStore);

      actions.addColumnPanel();

      expect(mockPanelStore.addPanel).toHaveBeenCalledWith({
        row: 0,
        column: 0,
      });
    });
  });

  describe("openTab", () => {
    it("should open a new tab in the active panel", async () => {
      const path = "C:\\test\\path";

      await actions.openTab(path);

      expect(mockTabStore.addTab).toHaveBeenCalledWith("panel1", path);
      expect(mockFileStore.loadDirectory).toHaveBeenCalledWith(
        "panel1",
        "new-tab-id",
        path
      );
    });

    it("should handle no active panel", async () => {
      (usePanelStore.getState as any).mockReturnValue({
        ...mockPanelStore,
        activePanelId: "",
      });

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await actions.openTab("C:\\test\\path");

      expect(mockTabStore.addTab).not.toHaveBeenCalled();
      expect(mockFileStore.loadDirectory).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith("No active panel found");

      consoleErrorSpy.mockRestore();
    });
  });

  describe("moveDirectory", () => {
    it("should load a directory and update the tab", async () => {
      const tabId = "tab1";
      const path = "C:\\test\\path";

      await actions.moveDirectory(tabId, path);

      expect(mockFileStore.loadDirectory).toHaveBeenCalledWith(
        "panel1",
        tabId,
        path
      );
      expect(mockTabStore.updateTab).toHaveBeenCalledWith(
        "panel1",
        tabId,
        "path",
        path
      );
    });

    it("should handle no active panel", async () => {
      (usePanelStore.getState as any).mockReturnValue({
        ...mockPanelStore,
        activePanelId: "",
      });

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await actions.moveDirectory("tab1", "C:\\test\\path");

      expect(mockFileStore.loadDirectory).not.toHaveBeenCalled();
      expect(mockTabStore.updateTab).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("closeTab", () => {
    it("should close a tab and clean up file state", () => {
      const panelId = "panel1";
      const tabId = "tab1";

      actions.closeTab(panelId, tabId);

      expect(mockTabStore.closeTab).toHaveBeenCalledWith(panelId, tabId);
      expect(mockFileStore.setFileState).toHaveBeenCalledWith(panelId, tabId, {
        files: [],
        selectedIndex: -1,
        currentDir: "",
      });
    });
  });

  describe("switchTab", () => {
    it("should switch to a different tab", () => {
      const panelId = "panel1";
      const tabId = "tab1";

      actions.switchTab(panelId, tabId);

      expect(mockTabStore.switchTab).toHaveBeenCalledWith(panelId, tabId);
    });
  });

  describe("setSort", () => {
    it("should set both sort key and order", () => {
      const panelId = "panel1";
      const tabId = "tab1";
      const sortKey = "size";
      const sortOrder = "desc";

      actions.setSort(panelId, tabId, sortKey, sortOrder);

      expect(mockFileStore.setSortKey).toHaveBeenCalledWith(
        panelId,
        tabId,
        sortKey
      );
      expect(mockFileStore.setSortOrder).toHaveBeenCalledWith(
        panelId,
        tabId,
        sortOrder
      );
    });
  });

  describe("initializeApp", () => {
    it("should initialize the app with a panel if none exists", () => {
      // Mock empty panel list
      (usePanelStore.getState as any).mockReturnValue({
        ...mockPanelStore,
        panels: [],
      });

      actions.initializeApp();

      expect(mockPanelStore.addPanel).toHaveBeenCalledWith({
        row: 0,
        column: 0,
      });
      expect(registerDefaultCommands).toHaveBeenCalled();
    });

    it("should not add a panel if panels already exist", () => {
      actions.initializeApp();

      expect(mockPanelStore.addPanel).not.toHaveBeenCalled();
      expect(registerDefaultCommands).toHaveBeenCalled();
    });
  });
});
