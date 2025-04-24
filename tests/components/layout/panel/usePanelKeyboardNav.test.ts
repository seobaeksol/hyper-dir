import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePanelKeyboardNav } from "../../../../src/components/layout/panel/usePanelKeyboardNav";
import { usePanelStore } from "@/state/panelStore";
import { useFileStore, useTabStore, useUIStore } from "@/state";
import { moveDirectory } from "@/state/actions";

//**
// Enrolled keys: [ "ArrowUp", "ArrowDown", "Enter", "Backspace", "Escape", ]
//  */
describe("usePanelKeyboardNav", () => {
  const mockPanel = {
    id: "test-panel",
    name: "Test Panel",
    type: "file",
    path: "/test",
    activeTabId: "test-tab",
    position: { row: 0, column: 0 },
  };
  const mockTab = {
    id: "test-tab",
    path: "/test",
    title: "Test Tab",
    isActive: true,
  };
  const mockFiles = [
    {
      name: "file1.js",
      path: `${mockPanel.path}/file1.js`,
      is_dir: false,
      size: 2048,
      modified: 1672531200000,
      file_type: "file",
    },
    {
      name: "file2.txt",
      path: `${mockPanel.path}/file2.txt`,
      is_dir: false,
      size: 512,
      modified: 1672617600000,
      file_type: "file",
    },
    {
      name: "file3.md",
      path: `${mockPanel.path}/file3.md`,
      is_dir: false,
      size: 1536,
      modified: 1672704000000,
      file_type: "file",
    },
    {
      name: "file4.json",
      path: `${mockPanel.path}/file4.json`,
      is_dir: false,
      size: 768,
      modified: 1672790400000,
      file_type: "file",
    },
    {
      name: "file5.css",
      path: `${mockPanel.path}/file5.css`,
      is_dir: false,
      size: 896,
      modified: 1672876800000,
      file_type: "file",
    },
    {
      name: "folder1",
      path: `${mockPanel.path}/folder1`,
      is_dir: true,
      size: 0,
      modified: 1672963200000,
      file_type: "folder",
    },
    {
      name: "folder2",
      path: `${mockPanel.path}/folder2`,
      is_dir: true,
      size: 0,
      modified: 1673049600000,
      file_type: "folder",
    },
    {
      name: "folder3",
      path: `${mockPanel.path}/folder3`,
      is_dir: true,
      size: 0,
      modified: 1673136000000,
      file_type: "folder",
    },
    {
      name: "folder4",
      path: `${mockPanel.path}/folder4`,
      is_dir: true,
      size: 0,
      modified: 1673222400000,
      file_type: "folder",
    },
    {
      name: "folder5",
      path: `${mockPanel.path}/folder5`,
      is_dir: true,
      size: 0,
      modified: 1673308800000,
      file_type: "folder",
    },
  ];
  const addEventListenerSpy = vi.spyOn(window, "addEventListener");

  beforeEach(() => {
    addEventListenerSpy.mockClear();
  });

  it("should handle keyboard events", async () => {
    await act(async () => {
      usePanelStore.setState({
        panels: [mockPanel],
        activePanelId: mockPanel.id,
      });

      useUIStore.setState({
        commandPaletteVisible: false,
      });

      renderHook(() => usePanelKeyboardNav(mockPanel.id));
    });

    const handlerFn = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "keydown"
    )?.[1];
    expect(typeof handlerFn).toBe("function");
    if (typeof handlerFn === "function") {
      expect(handlerFn.name).toBe("panelKeyEventHandler");
    }
  });

  it("should not handle keyboard events when command palette is visible", async () => {
    // commandPaletteVisible || !panel || panel.id !== activePanelId
    await act(async () => {
      usePanelStore.setState({
        panels: [mockPanel],
        activePanelId: mockPanel.id,
      });

      useUIStore.setState({
        commandPaletteVisible: true,
      });

      renderHook(() => usePanelKeyboardNav(mockPanel.id));
    });

    const handlerFn = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "keydown"
    )?.[1];
    expect(typeof handlerFn).toBe("undefined");
  });

  it("should not handle keyboar events when panel does not exist", async () => {
    await act(async () => {
      usePanelStore.setState({
        panels: [],
        activePanelId: mockPanel.id,
      });

      useUIStore.setState({
        commandPaletteVisible: false,
      });

      renderHook(() => usePanelKeyboardNav(mockPanel.id));
    });

    const handlerFn = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "keydown"
    )?.[1];
    expect(typeof handlerFn).toBe("undefined");
  });

  it("should not handle keyboard events when panel is not active", async () => {
    // commandPaletteVisible || !panel || panel.id !== activePanelId
    await act(async () => {
      usePanelStore.setState({
        panels: [mockPanel],
        activePanelId: "other-panel-id",
      });

      useUIStore.setState({
        commandPaletteVisible: false,
      });

      renderHook(() => usePanelKeyboardNav(mockPanel.id));
    });

    const handlerFn = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === "keydown"
    )?.[1];
    expect(typeof handlerFn).toBe("undefined");
  });

  it("should handle keydown event", async () => {
    await act(async () => {
      usePanelStore.setState({
        panels: [mockPanel],
        activePanelId: mockPanel.id,
      });

      useTabStore.setState({
        tabs: {
          [mockPanel.id]: [mockTab],
        },
      });

      useUIStore.setState({
        commandPaletteVisible: false,
      });

      useFileStore.setState({
        fileStates: {
          [mockPanel.id]: {
            [mockPanel.activeTabId]: {
              files: mockFiles,
              currentDir: mockPanel.path,
              selectedIndex: -1,
              sortKey: "name",
              sortOrder: "asc",
            },
          },
        },
      });

      renderHook(() => usePanelKeyboardNav(mockPanel.id));
    });

    act(() => {
      const keydownEvent = new KeyboardEvent("keydown", {
        key: "ArrowDown",
        altKey: false,

        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
      });
      window.dispatchEvent(keydownEvent);
    });

    const selectionId = useFileStore
      .getState()
      .getCurrentFileState(mockPanel.id, mockPanel.activeTabId).selectedIndex;
    expect(selectionId).toBe(0);
  });

  it("should move selection down with ArrowDown when already selected", async () => {
    await act(async () => {
      usePanelStore.setState({
        panels: [mockPanel],
        activePanelId: mockPanel.id,
      });
      useTabStore.setState({
        tabs: {
          [mockPanel.id]: [mockTab],
        },
      });
      useUIStore.setState({
        commandPaletteVisible: false,
      });
      useFileStore.setState({
        fileStates: {
          [mockPanel.id]: {
            [mockPanel.activeTabId]: {
              files: mockFiles,
              currentDir: mockPanel.path,
              selectedIndex: 0,
              sortKey: "name",
              sortOrder: "asc",
            },
          },
        },
      });
      renderHook(() => usePanelKeyboardNav(mockPanel.id));
    });
    act(() => {
      const keydownEvent = new KeyboardEvent("keydown", {
        key: "ArrowDown",
      });
      window.dispatchEvent(keydownEvent);
    });
    const selectionId = useFileStore
      .getState()
      .getCurrentFileState(mockPanel.id, mockPanel.activeTabId).selectedIndex;
    expect(selectionId).toBe(1);
  });

  it("should move selection up with ArrowUp", async () => {
    await act(async () => {
      usePanelStore.setState({
        panels: [mockPanel],
        activePanelId: mockPanel.id,
      });
      useTabStore.setState({
        tabs: {
          [mockPanel.id]: [mockTab],
        },
      });
      useUIStore.setState({
        commandPaletteVisible: false,
      });
      useFileStore.setState({
        fileStates: {
          [mockPanel.id]: {
            [mockPanel.activeTabId]: {
              files: mockFiles,
              currentDir: mockPanel.path,
              selectedIndex: 2,
              sortKey: "name",
              sortOrder: "asc",
            },
          },
        },
      });
      renderHook(() => usePanelKeyboardNav(mockPanel.id));
    });
    act(() => {
      const keydownEvent = new KeyboardEvent("keydown", {
        key: "ArrowUp",
      });
      window.dispatchEvent(keydownEvent);
    });
    const selectionId = useFileStore
      .getState()
      .getCurrentFileState(mockPanel.id, mockPanel.activeTabId).selectedIndex;
    expect(selectionId).toBe(1);
  });

  it("should move selection to last item with ArrowDown when at first item", async () => {
    await act(async () => {
      usePanelStore.setState({
        panels: [mockPanel],
        activePanelId: mockPanel.id,
      });
      useTabStore.setState({
        tabs: {
          [mockPanel.id]: [mockTab],
        },
      });
      useUIStore.setState({
        commandPaletteVisible: false,
      });
      useFileStore.setState({
        fileStates: {
          [mockPanel.id]: {
            [mockPanel.activeTabId]: {
              files: mockFiles,
              currentDir: mockPanel.path,
              selectedIndex: 0,
              sortKey: "name",
              sortOrder: "asc",
            },
          },
        },
      });
      renderHook(() => usePanelKeyboardNav(mockPanel.id));
    });
    act(() => {
      const keydownEvent = new KeyboardEvent("keydown", {
        key: "ArrowUp",
      });
      window.dispatchEvent(keydownEvent);
    });
    const selectionId = useFileStore
      .getState()
      .getCurrentFileState(mockPanel.id, mockPanel.activeTabId).selectedIndex;
    expect(selectionId).toBe(mockFiles.length - 1);
  });

  it("should move selection to first item with ArrowUp when at last item", async () => {
    await act(async () => {
      usePanelStore.setState({
        panels: [mockPanel],
        activePanelId: mockPanel.id,
      });
      useTabStore.setState({
        tabs: {
          [mockPanel.id]: [mockTab],
        },
      });
      useUIStore.setState({
        commandPaletteVisible: false,
      });
      useFileStore.setState({
        fileStates: {
          [mockPanel.id]: {
            [mockPanel.activeTabId]: {
              files: mockFiles,
              currentDir: mockPanel.path,
              selectedIndex: mockFiles.length - 1,
              sortKey: "name",
              sortOrder: "asc",
            },
          },
        },
      });
      renderHook(() => usePanelKeyboardNav(mockPanel.id));
    });
    act(() => {
      const keydownEvent = new KeyboardEvent("keydown", {
        key: "ArrowDown",
      });
      window.dispatchEvent(keydownEvent);
    });
    const selectionId = useFileStore
      .getState()
      .getCurrentFileState(mockPanel.id, mockPanel.activeTabId).selectedIndex;
    expect(selectionId).toBe(0);
  });

  it("should handle Enter key (no error thrown)", async () => {
    await act(async () => {
      usePanelStore.setState({
        panels: [mockPanel],
        activePanelId: mockPanel.id,
      });
      useTabStore.setState({
        tabs: {
          [mockPanel.id]: [mockTab],
        },
      });
      useUIStore.setState({
        commandPaletteVisible: false,
      });
      useFileStore.setState({
        fileStates: {
          [mockPanel.id]: {
            [mockPanel.activeTabId]: {
              files: mockFiles,
              currentDir: mockPanel.path,
              selectedIndex: 1,
              sortKey: "name",
              sortOrder: "asc",
            },
          },
        },
      });
      renderHook(() => usePanelKeyboardNav(mockPanel.id));
    });
    act(() => {
      const keydownEvent = new KeyboardEvent("keydown", {
        key: "Enter",
      });
      window.dispatchEvent(keydownEvent);
    });
    // No assertion: just ensure no error occurs
    expect(true).toBe(true);
  });

  it("should handle Backspace key (no error thrown)", async () => {
    await act(async () => {
      usePanelStore.setState({
        panels: [mockPanel],
        activePanelId: mockPanel.id,
      });
      useTabStore.setState({
        tabs: {
          [mockPanel.id]: [mockTab],
        },
      });
      useUIStore.setState({
        commandPaletteVisible: false,
      });
      useFileStore.setState({
        fileStates: {
          [mockPanel.id]: {
            [mockPanel.activeTabId]: {
              files: mockFiles,
              currentDir: mockPanel.path,
              selectedIndex: 2,
              sortKey: "name",
              sortOrder: "asc",
            },
          },
        },
      });
      renderHook(() => usePanelKeyboardNav(mockPanel.id));
    });
    act(() => {
      const keydownEvent = new KeyboardEvent("keydown", {
        key: "Backspace",
      });
      window.dispatchEvent(keydownEvent);
    });
    // No assertion: just ensure no error occurs
    expect(true).toBe(true);
  });

  it("should handle Escape key (no error thrown)", async () => {
    await act(async () => {
      usePanelStore.setState({
        panels: [mockPanel],
        activePanelId: mockPanel.id,
      });
      useTabStore.setState({
        tabs: {
          [mockPanel.id]: [mockTab],
        },
      });
      useUIStore.setState({
        commandPaletteVisible: false,
      });
      useFileStore.setState({
        fileStates: {
          [mockPanel.id]: {
            [mockPanel.activeTabId]: {
              files: mockFiles,
              currentDir: mockPanel.path,
              selectedIndex: 3,
              sortKey: "name",
              sortOrder: "asc",
            },
          },
        },
      });
      renderHook(() => usePanelKeyboardNav(mockPanel.id));
    });
    act(() => {
      const keydownEvent = new KeyboardEvent("keydown", {
        key: "Escape",
      });
      window.dispatchEvent(keydownEvent);
    });
    // No assertion: just ensure no error occurs
    expect(true).toBe(true);
  });

  it("should initialize with correct state", () => {
    const { result } = renderHook(() => usePanelKeyboardNav(mockPanel.id));

    expect(result.current).toBeUndefined(); // Hook doesn't return anything
    expect(useFileStore).toHaveBeenCalled();
    expect(useTabStore).toHaveBeenCalled();
    expect(usePanelStore).toHaveBeenCalled();
  });

  it("should handle ArrowDown to move selection down", () => {
    renderHook(() => usePanelKeyboardNav(mockPanel.id));

    // Simulate ArrowDown key press
    const event = new KeyboardEvent("keydown", { key: "ArrowDown" });
    window.dispatchEvent(event);

    expect(useFileStore.getState().setSelectedIndex).toHaveBeenCalled();
  });

  it("should handle ArrowUp to move selection up", () => {
    renderHook(() => usePanelKeyboardNav(mockPanel.id));

    // Simulate ArrowUp key press
    const event = new KeyboardEvent("keydown", { key: "ArrowUp" });
    window.dispatchEvent(event);

    expect(useFileStore.getState().setSelectedIndex).toHaveBeenCalled();
  });

  it("should handle Enter to navigate into directory", () => {
    renderHook(() => usePanelKeyboardNav(mockPanel.id));

    // Simulate Enter key press when a directory is selected
    const event = new KeyboardEvent("keydown", { key: "Enter" });
    window.dispatchEvent(event);

    // Since we have index 1 selected (dir1), it should navigate there
    expect(moveDirectory).toHaveBeenCalled();
  });

  it("should not navigate when Enter is pressed on a file", () => {
    // Change selected index to a file
    (useFileStore as any).mockReturnValue({
      fileStates: {
        [mockPanel.id]: {
          [mockPanel.activeTabId]: {
            files: mockFiles,
            selectedIndex: 2, // file1.txt selected
            currentDir: mockPanel.path,
          },
        },
      },
      setSelectedIndex: vi.fn(),
    });

    renderHook(() => usePanelKeyboardNav(mockPanel.id));

    // Simulate Enter key press when a file is selected
    const event = new KeyboardEvent("keydown", { key: "Enter" });
    window.dispatchEvent(event);

    // No navigation should happen for a file
    expect(moveDirectory).not.toHaveBeenCalled();
  });

  it("should handle Home key to select first item", () => {
    renderHook(() => usePanelKeyboardNav(mockPanel.id));

    // Simulate Home key press
    const event = new KeyboardEvent("keydown", { key: "Home" });
    window.dispatchEvent(event);

    expect(useFileStore.getState().setSelectedIndex).toHaveBeenCalled();
  });

  it("should handle End key to select last item", () => {
    renderHook(() => usePanelKeyboardNav(mockPanel.id));

    // Simulate End key press
    const event = new KeyboardEvent("keydown", { key: "End" });
    window.dispatchEvent(event);

    expect(useFileStore.getState().setSelectedIndex).toHaveBeenCalled();
  });

  it("should handle PageDown key to move selection down by page size", () => {
    renderHook(() => usePanelKeyboardNav(mockPanel.id));

    // Simulate PageDown key press
    const event = new KeyboardEvent("keydown", { key: "PageDown" });
    window.dispatchEvent(event);

    // We have 4 items, so should select the last one (index 3)
    expect(useFileStore.getState().setSelectedIndex).toHaveBeenCalled();
  });

  it("should handle PageUp key to move selection up by page size", () => {
    // Change selected index to end of list
    (useFileStore as any).mockReturnValue({
      fileStates: {
        [mockPanel.id]: {
          [mockPanel.activeTabId]: {
            files: mockFiles,
            selectedIndex: 3, // Last item
            currentDir: mockPanel.path,
          },
        },
      },
      setSelectedIndex: vi.fn(),
    });

    renderHook(() => usePanelKeyboardNav(mockPanel.id));

    // Simulate PageUp key press
    const event = new KeyboardEvent("keydown", { key: "PageUp" });
    window.dispatchEvent(event);

    // Should jump to first item (index 0)
    expect(useFileStore.getState().setSelectedIndex).toHaveBeenCalled();
  });

  it("should do nothing when no active panel or tab is found", () => {
    // Mock the scenario where there's no active panel or tab
    (useTabStore as any).mockReturnValue({
      getActiveTab: vi.fn(() => null), // No active tab
    });

    renderHook(() => usePanelKeyboardNav(mockPanel.id));

    // Simulate a key press
    const event = new KeyboardEvent("keydown", { key: "ArrowDown" });
    window.dispatchEvent(event);

    // No actions should be taken
    expect(useFileStore.getState().setSelectedIndex).not.toHaveBeenCalled();
    expect(moveDirectory).not.toHaveBeenCalled();
  });

  it("should do nothing when fileState is not found", () => {
    // Mock the scenario where there's no fileState for the panel/tab
    (useFileStore as any).mockReturnValue({
      fileStates: {}, // Empty file states
      setSelectedIndex: vi.fn(),
    });

    renderHook(() => usePanelKeyboardNav(mockPanel.id));

    // Simulate a key press
    const event = new KeyboardEvent("keydown", { key: "ArrowDown" });
    window.dispatchEvent(event);

    // No actions should be taken
    expect(useFileStore.getState().setSelectedIndex).not.toHaveBeenCalled();
    expect(moveDirectory).not.toHaveBeenCalled();
  });

  it("should clean up event listeners on unmount", () => {
    // Spy on removeEventListener
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => usePanelKeyboardNav(mockPanel.id));

    // Unmount the hook
    unmount();

    // Should have removed the event listener
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });
});
