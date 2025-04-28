import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useUIStore } from "@/state/uiStore";

describe("state/uiStore", () => {
  // Reset the store before each test to ensure test isolation
  beforeEach(() => {
    useUIStore.setState({
      sidebar: {
        left: { display: false, activeTabId: "explorer" },
        right: { display: false, activeTabId: "config" },
      },
      commandPaletteVisible: false,
      focusedPanel: "left",
    });
  });

  // Clean up after all tests
  afterEach(() => {
    useUIStore.setState({
      sidebar: {
        left: { display: false, activeTabId: "explorer" },
        right: { display: false, activeTabId: "config" },
      },
      commandPaletteVisible: false,
      focusedPanel: "left",
    });
  });

  it("should initialize with default values", () => {
    const state = useUIStore.getState();

    expect(state.sidebar.left.display).toBe(false);
    expect(state.sidebar.left.activeTabId).toBe("explorer");

    expect(state.sidebar.right.display).toBe(false);
    expect(state.sidebar.right.activeTabId).toBe("config");

    expect(state.commandPaletteVisible).toBe(false);
    expect(state.focusedPanel).toBe("left");
  });

  describe("sidebar visibility", () => {
    it("should set sidebar visibility", () => {
      const { setSidebarVisible } = useUIStore.getState();

      setSidebarVisible("left", true);
      expect(useUIStore.getState().sidebar.left.display).toBe(true);

      setSidebarVisible("right", true);
      expect(useUIStore.getState().sidebar.right.display).toBe(true);

      setSidebarVisible("left", false);
      expect(useUIStore.getState().sidebar.left.display).toBe(false);
    });

    it("should toggle sidebar visibility", () => {
      const { toggleSidebar } = useUIStore.getState();

      toggleSidebar("left");
      expect(useUIStore.getState().sidebar.left.display).toBe(true);

      toggleSidebar("left");
      expect(useUIStore.getState().sidebar.left.display).toBe(false);

      toggleSidebar("right");
      expect(useUIStore.getState().sidebar.right.display).toBe(true);
    });
  });

  describe("sidebar tabs", () => {
    it("should set active tab", () => {
      const { setActiveTab } = useUIStore.getState();

      setActiveTab("left", "search");
      expect(useUIStore.getState().sidebar.left.activeTabId).toBe("search");

      setActiveTab("right", "git");
      expect(useUIStore.getState().sidebar.right.activeTabId).toBe("git");
    });
  });

  describe("command palette", () => {
    it("should toggle command palette visibility", () => {
      const { toggleCommandPalette } = useUIStore.getState();

      toggleCommandPalette();
      expect(useUIStore.getState().commandPaletteVisible).toBe(true);

      toggleCommandPalette();
      expect(useUIStore.getState().commandPaletteVisible).toBe(false);
    });

    it("should set command palette visibility", () => {
      const { setCommandPaletteVisible } = useUIStore.getState();

      setCommandPaletteVisible(true);
      expect(useUIStore.getState().commandPaletteVisible).toBe(true);

      setCommandPaletteVisible(false);
      expect(useUIStore.getState().commandPaletteVisible).toBe(false);
    });
  });

  describe("focused panel", () => {
    it("should set focused panel", () => {
      const { setFocusedPanel } = useUIStore.getState();

      setFocusedPanel("right");
      expect(useUIStore.getState().focusedPanel).toBe("right");

      setFocusedPanel("left");
      expect(useUIStore.getState().focusedPanel).toBe("left");
    });
  });
});
