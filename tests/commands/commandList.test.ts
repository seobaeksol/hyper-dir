import { getDefaultCommands } from "@/commands/commandList";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { useUIStore } from "@/state/uiStore";
import { usePanelStore } from "@/state/panelStore";
import * as actions from "@/state/actions";
import { Command } from "@/state/commandStore";
import { act } from "@testing-library/react";

// Mock dependencies
vi.mock("@/state/uiStore", () => ({
  useUIStore: {
    getState: vi.fn(),
  },
}));

vi.mock("@/state/panelStore", () => ({
  usePanelStore: {
    getState: vi.fn(),
  },
}));

vi.spyOn(actions, "getNextAvailablePosition");
vi.spyOn(actions, "addRowPanel");
vi.spyOn(actions, "addColumnPanel");

describe("commandList", () => {
  const toggleSidebarMock = vi.fn();
  const addPanelMock = vi.fn();
  const removePanelMock = vi.fn();
  const setActivePanelMock = vi.fn();
  let commands: Command[];

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mocks
    (useUIStore.getState as Mock).mockReturnValue({
      toggleSidebar: toggleSidebarMock,
    });

    (usePanelStore.getState as Mock).mockReturnValue({
      addPanel: addPanelMock,
      removePanel: removePanelMock,
      setActivePanel: setActivePanelMock,
      activePanelId: "panel1",
      panels: [
        { id: "panel1", position: { row: 1, column: 1 } },
        { id: "panel2", position: { row: 1, column: 2 } },
        { id: "panel3", position: { row: 2, column: 1 } },
      ],
    });

    (actions.getNextAvailablePosition as Mock).mockReturnValue({
      row: 0,
      column: 0,
    });

    commands = getDefaultCommands();
  });

  it("should export a non-empty array of commands", () => {
    expect(Array.isArray(commands)).toBe(true);
    expect(commands.length).toBeGreaterThan(0);
  });

  it("should have required properties for each command", () => {
    for (const cmd of commands) {
      expect(typeof cmd.id).toBe("string");
      expect(cmd.id.length).toBeGreaterThan(0);
      expect(typeof cmd.title).toBe("string");
      expect(cmd.title.length).toBeGreaterThan(0);
      expect(typeof cmd.action).toBe("function");
    }
  });

  it("should have unique command ids", () => {
    const ids = commands.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should contain all known command ids", () => {
    const knownIds = [
      "open-folder",
      "toggle-left-sidebar",
      "toggle-right-sidebar",
      "create-panel",
      "add-row-panel",
      "add-column-panel",
      "close-panel",
      "focus-panel-up",
      "focus-panel-down",
      "focus-panel-left",
      "focus-panel-right",
    ];
    const ids = commands.map((c) => c.id);
    for (const id of knownIds) {
      expect(ids).toContain(id);
    }
  });

  it("should call toggleSidebar with correct arguments", () => {
    // Test left sidebar toggle
    const leftToggleCmd = commands.find(
      (c: Command) => c.id === "toggle-left-sidebar"
    );
    leftToggleCmd?.action();
    expect(toggleSidebarMock).toHaveBeenCalledWith("left");

    // Test right sidebar toggle
    const rightToggleCmd = commands.find(
      (c: Command) => c.id === "toggle-right-sidebar"
    );
    rightToggleCmd?.action();
    expect(toggleSidebarMock).toHaveBeenCalledWith("right");
  });

  it("should create a new panel with the next available position", () => {
    const createPanelCmd = commands.find(
      (c: Command) => c.id === "create-panel"
    );
    createPanelCmd?.action();
    expect(actions.getNextAvailablePosition).toHaveBeenCalled();
    expect(addPanelMock).toHaveBeenCalledWith({ row: 0, column: 0 });
  });

  it("should add row panel", () => {
    const addRowCmd = commands.find((c: Command) => c.id === "add-row-panel");
    addRowCmd?.action();
    expect(actions.addRowPanel).toHaveBeenCalled();
  });

  it("should add column panel", () => {
    const addColumnCmd = commands.find(
      (c: Command) => c.id === "add-column-panel"
    );
    addColumnCmd?.action();
    expect(actions.addColumnPanel).toHaveBeenCalled();
  });

  it("should close panel if there is more than one panel", () => {
    const closePanelCmd = commands.find((c: Command) => c.id === "close-panel");
    closePanelCmd?.action();
    expect(removePanelMock).toHaveBeenCalledWith("panel1");
  });

  it("should not close panel if it's the only panel", () => {
    // Mock having only one panel
    (usePanelStore.getState as Mock).mockClear().mockReturnValue({
      addPanel: addPanelMock,
      removePanel: removePanelMock,
      setActivePanel: setActivePanelMock,
      activePanelId: "not-used",
      panels: [{ id: "not-used", position: { row: 1, column: 1 } }],
    });

    const closePanelCmd = commands.find((c: Command) => c.id === "close-panel");

    act(() => {
      closePanelCmd?.action();
    });

    expect(removePanelMock).not.toHaveBeenCalled();
  });

  it("should focus panel above current panel", () => {
    // Setup panel above the current one
    (usePanelStore.getState as Mock).mockReturnValueOnce({
      activePanelId: "panel3",
      panels: [
        { id: "panel1", position: { row: 1, column: 1 } }, // panel above
        { id: "panel3", position: { row: 2, column: 1 } }, // current panel
      ],
      setActivePanel: setActivePanelMock,
    });

    const focusPanelUpCmd = commands.find(
      (c: Command) => c.id === "focus-panel-up"
    );
    focusPanelUpCmd?.action();
    expect(setActivePanelMock).toHaveBeenCalledWith("panel1");
  });

  it("should focus panel below current panel", () => {
    // Setup panel below the current one
    (usePanelStore.getState as Mock).mockReturnValueOnce({
      activePanelId: "panel1",
      panels: [
        { id: "panel1", position: { row: 1, column: 1 } }, // current panel
        { id: "panel3", position: { row: 2, column: 1 } }, // panel below
      ],
      setActivePanel: setActivePanelMock,
    });

    const focusPanelDownCmd = commands.find(
      (c: Command) => c.id === "focus-panel-down"
    );
    focusPanelDownCmd?.action();
    expect(setActivePanelMock).toHaveBeenCalledWith("panel3");
  });

  it("should focus panel to the left of current panel", () => {
    // Setup panel to the left of the current one
    (usePanelStore.getState as Mock).mockReturnValueOnce({
      activePanelId: "panel2",
      panels: [
        { id: "panel1", position: { row: 1, column: 1 } }, // panel to the left
        { id: "panel2", position: { row: 1, column: 2 } }, // current panel
      ],
      setActivePanel: setActivePanelMock,
    });

    const focusPanelLeftCmd = commands.find(
      (c: Command) => c.id === "focus-panel-left"
    );
    focusPanelLeftCmd?.action();
    expect(setActivePanelMock).toHaveBeenCalledWith("panel1");
  });

  it("should focus panel to the right of current panel", () => {
    // Setup panel to the right of the current one
    (usePanelStore.getState as Mock).mockReturnValueOnce({
      activePanelId: "panel1",
      panels: [
        { id: "panel1", position: { row: 1, column: 1 } }, // current panel
        { id: "panel2", position: { row: 1, column: 2 } }, // panel to the right
      ],
      setActivePanel: setActivePanelMock,
    });

    const focusPanelRightCmd = commands.find(
      (c: Command) => c.id === "focus-panel-right"
    );
    focusPanelRightCmd?.action();
    expect(setActivePanelMock).toHaveBeenCalledWith("panel2");
  });

  it("should not change focus if no matching panel exists", () => {
    // Setup no panels in the target direction
    (usePanelStore.getState as Mock).mockReturnValueOnce({
      activePanelId: "panel1",
      panels: [
        { id: "panel1", position: { row: 1, column: 1 } }, // no panels in any direction
      ],
      setActivePanel: setActivePanelMock,
    });

    const focusPanelUpCmd = commands.find(
      (c: Command) => c.id === "focus-panel-up"
    );
    focusPanelUpCmd?.action();
    expect(setActivePanelMock).not.toHaveBeenCalled();
  });

  it("should handle optional keywords property correctly", () => {
    for (const cmd of commands) {
      if (cmd.keywords !== undefined) {
        expect(Array.isArray(cmd.keywords)).toBe(true);
        for (const kw of cmd.keywords) {
          expect(typeof kw).toBe("string");
        }
      }
    }
  });
});
