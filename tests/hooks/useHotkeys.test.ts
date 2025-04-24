import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useHotkeys } from "@/hooks/useHotkeys";
import { renderHook } from "@testing-library/react";
import { useSidebarController } from "@/hooks/useSidebarController";
import { useCommandStore } from "@/state/commandStore";
import { usePanelStore } from "@/state/panelStore";
import * as actions from "@/state/actions";

// Mock all the dependencies
vi.mock("@/hooks/useSidebarController", () => ({
  useSidebarController: vi.fn(),
}));

vi.mock("@/state/commandStore", () => ({
  useCommandStore: vi.fn(),
}));

vi.mock("@/state/panelStore", () => ({
  usePanelStore: vi.fn(),
}));

vi.mock("@/state/actions", () => ({
  getNextAvailablePosition: vi.fn(),
  addRowPanel: vi.fn(),
  addColumnPanel: vi.fn(),
}));

describe("useHotkeys", () => {
  // Mock functions for all dependencies
  const leftToggleMock = vi.fn();
  const rightToggleMock = vi.fn();
  const toggleCommandPaletteMock = vi.fn();
  const addPanelMock = vi.fn();
  const removePanelMock = vi.fn();
  const setActivePanelMock = vi.fn();

  // Mock event handling
  let eventMap: Record<string, any> = {};

  // Helper function to create a keyboard event
  const createKeyboardEvent = (key: string, options = {}) => {
    const event = {
      key,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      preventDefault: vi.fn(),
      ...options,
    };
    return event;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset event handlers
    eventMap = {};

    // Mock event listeners
    vi.spyOn(window, "addEventListener").mockImplementation(
      (event, handler) => {
        eventMap[event] = handler;
      }
    );

    vi.spyOn(window, "removeEventListener").mockImplementation((event) => {
      delete eventMap[event];
    });

    // Mock useSidebarController
    (useSidebarController as any).mockImplementation(
      (side: "left" | "right") => {
        if (side === "left") {
          return {
            toggle: leftToggleMock,
            display: false,
            setVisible: vi.fn(),
            activeTabId: "explorer",
            setActiveTab: vi.fn(),
          };
        } else {
          return {
            toggle: rightToggleMock,
            display: true,
            setVisible: vi.fn(),
            activeTabId: "config",
            setActiveTab: vi.fn(),
          };
        }
      }
    );

    // Mock useCommandStore
    (useCommandStore as any).mockImplementation(
      (selector: (state: any) => any) => {
        return selector({
          toggleCommandPalette: toggleCommandPaletteMock,
        });
      }
    );

    // Mock usePanelStore for the active panels
    (usePanelStore as any).mockImplementation(() => ({
      addPanel: addPanelMock,
      removePanel: removePanelMock,
      setActivePanel: setActivePanelMock,
      panels: [
        { id: "panel1", position: { row: 0, column: 0 } },
        { id: "panel2", position: { row: 0, column: 1 } },
      ],
      activePanelId: "panel1",
    }));

    // Mock panel store getState
    (usePanelStore.getState as any) = vi.fn().mockReturnValue({
      activePanelId: "panel1",
      panels: [
        { id: "panel1", position: { row: 0, column: 0 } },
        { id: "panel2", position: { row: 0, column: 1 } },
      ],
    });

    // Mock getNextAvailablePosition
    (actions.getNextAvailablePosition as any).mockReturnValue({
      row: 1,
      column: 0,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should initialize without error", () => {
    renderHook(() => useHotkeys());
  });

  it("should register keydown event listener", () => {
    renderHook(() => useHotkeys());
    expect(window.addEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("should unregister keydown event listener on cleanup", () => {
    const { unmount } = renderHook(() => useHotkeys());
    unmount();
    expect(window.removeEventListener).toHaveBeenCalled();
  });

  it("should toggle right sidebar with Ctrl+B", () => {
    renderHook(() => useHotkeys());

    // Simulate Ctrl+B keydown
    const event = createKeyboardEvent("b", {
      ctrlKey: true,
    });

    // Trigger the event handler
    eventMap.keydown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(rightToggleMock).toHaveBeenCalled();
    expect(leftToggleMock).not.toHaveBeenCalled();
  });

  it("should toggle left sidebar with Ctrl+Alt+B", () => {
    renderHook(() => useHotkeys());

    // Simulate Ctrl+Alt+B keydown
    const event = createKeyboardEvent("b", {
      ctrlKey: true,
      altKey: true,
    });

    // Trigger the event handler
    eventMap.keydown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(leftToggleMock).toHaveBeenCalled();
    expect(rightToggleMock).not.toHaveBeenCalled();
  });

  it("should open command palette search mode with Ctrl+P", () => {
    renderHook(() => useHotkeys());

    // Simulate Ctrl+P keydown
    const event = createKeyboardEvent("p", {
      ctrlKey: true,
    });

    // Trigger the event handler
    eventMap.keydown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(toggleCommandPaletteMock).toHaveBeenCalledWith("search");
  });

  it("should open command palette command mode with Ctrl+Shift+P", () => {
    renderHook(() => useHotkeys());

    // Simulate Ctrl+Shift+P keydown
    const event = createKeyboardEvent("p", {
      ctrlKey: true,
      shiftKey: true,
    });

    // Trigger the event handler
    eventMap.keydown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(toggleCommandPaletteMock).toHaveBeenCalledWith("command");
  });

  it("should add panel with Ctrl+Alt+\\", () => {
    renderHook(() => useHotkeys());

    // Simulate Ctrl+Alt+\ keydown
    const event = createKeyboardEvent("\\", {
      ctrlKey: true,
      altKey: true,
    });

    // Trigger the event handler
    eventMap.keydown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(actions.getNextAvailablePosition).toHaveBeenCalled();
    expect(addPanelMock).toHaveBeenCalledWith({ row: 1, column: 0 });
  });

  it("should add a row panel with Ctrl+Alt+Shift+ArrowDown", () => {
    renderHook(() => useHotkeys());

    // Simulate Ctrl+Alt+Shift+ArrowDown keydown
    const event = createKeyboardEvent("ArrowDown", {
      ctrlKey: true,
      altKey: true,
      shiftKey: true,
    });

    // Trigger the event handler
    eventMap.keydown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(actions.addRowPanel).toHaveBeenCalled();
  });

  it("should add a column panel with Ctrl+Alt+Shift+ArrowRight", () => {
    renderHook(() => useHotkeys());

    // Simulate Ctrl+Alt+Shift+ArrowRight keydown
    const event = createKeyboardEvent("ArrowRight", {
      ctrlKey: true,
      altKey: true,
      shiftKey: true,
    });

    // Trigger the event handler
    eventMap.keydown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(actions.addColumnPanel).toHaveBeenCalled();
  });

  it("should remove panel with Ctrl+Alt+Q", () => {
    renderHook(() => useHotkeys());

    // Simulate Ctrl+Alt+Q keydown
    const event = createKeyboardEvent("q", {
      ctrlKey: true,
      altKey: true,
    });

    // Trigger the event handler
    eventMap.keydown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(removePanelMock).toHaveBeenCalledWith("panel1");
  });

  it("should navigate between panels with arrow keys", () => {
    renderHook(() => useHotkeys());

    // Simulate Ctrl+Alt+Right keydown to move to right panel
    const event = createKeyboardEvent("ArrowRight", {
      ctrlKey: true,
      altKey: true,
    });

    // Trigger the event handler
    eventMap.keydown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(setActivePanelMock).toHaveBeenCalledWith("panel2");
  });

  it("should not trigger navigation when using shift key with arrow keys", () => {
    renderHook(() => useHotkeys());

    // Simulate Ctrl+Alt+Shift+Left keydown (should not navigate)
    const event = createKeyboardEvent("ArrowLeft", {
      ctrlKey: true,
      altKey: true,
      shiftKey: true,
    });

    // Trigger the event handler
    eventMap.keydown(event);

    // Should not call setActivePanel since Shift is pressed
    expect(setActivePanelMock).not.toHaveBeenCalled();
  });

  it("should not navigate when no panel exists in the target direction", () => {
    renderHook(() => useHotkeys());

    // Simulate Ctrl+Alt+Left keydown (no panel exists to the left)
    const event = createKeyboardEvent("ArrowLeft", {
      ctrlKey: true,
      altKey: true,
    });

    // Trigger the event handler
    eventMap.keydown(event);

    // No panel exists to the left of panel1, so setActivePanel should not be called
    expect(setActivePanelMock).not.toHaveBeenCalled();
  });
});
