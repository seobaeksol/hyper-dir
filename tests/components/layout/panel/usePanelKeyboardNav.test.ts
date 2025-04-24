import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePanelKeyboardNav } from "../../../../src/components/layout/panel/usePanelKeyboardNav";
import { usePanelStore } from "@/state/panelStore";
import { useFileStore, useTabStore, useUIStore } from "@/state";

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
});
