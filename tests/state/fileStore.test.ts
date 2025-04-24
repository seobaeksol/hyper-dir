import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useFileStore, SortKey, SortOrder } from "@/state/fileStore";
import { readDirectory } from "@/ipc/fs";
import { dirname } from "@tauri-apps/api/path";

// Mock dependencies
vi.mock("@/ipc/fs", () => ({
  readDirectory: vi.fn(),
}));

vi.mock("@tauri-apps/api/path", () => ({
  dirname: vi.fn(),
}));

describe("state/fileStore", () => {
  const panelId = "panel-1";
  const tabId = "tab-1";

  const mockFiles = [
    {
      name: "file1.txt",
      path: "C:\\test\\file1.txt",
      is_dir: false,
      size: 1024,
      modified: 1713775552,
      file_type: "txt",
    },
    {
      name: "folder1",
      path: "C:\\test\\folder1",
      is_dir: true,
      file_type: "dir",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useFileStore.setState({ fileStates: {} });
    (readDirectory as any).mockResolvedValue(mockFiles);
    (dirname as any).mockResolvedValue("C:\\");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with empty fileStates", () => {
    const state = useFileStore.getState();
    expect(state.fileStates).toEqual({});
  });

  describe("getCurrentFileState", () => {
    it("should return default state when no state exists", () => {
      const { getCurrentFileState } = useFileStore.getState();

      const state = getCurrentFileState(panelId, tabId);

      expect(state).toEqual({
        files: [],
        selectedIndex: -1,
        currentDir: "",
        sortKey: "name" as SortKey,
        sortOrder: "asc" as SortOrder,
      });
    });

    it("should return existing state", () => {
      const existingState = {
        files: mockFiles,
        selectedIndex: 1,
        currentDir: "C:\\test",
        sortKey: "size" as SortKey,
        sortOrder: "desc" as SortOrder,
      };

      useFileStore.setState({
        fileStates: {
          [panelId]: {
            [tabId]: existingState,
          },
        },
      });

      const { getCurrentFileState } = useFileStore.getState();
      const state = getCurrentFileState(panelId, tabId);

      expect(state).toEqual(existingState);
    });
  });

  describe("setFileState", () => {
    it("should set file state", () => {
      const { setFileState } = useFileStore.getState();

      setFileState(panelId, tabId, {
        files: mockFiles,
        selectedIndex: 1,
        currentDir: "C:\\test",
      });

      const state = useFileStore.getState().fileStates[panelId][tabId];
      expect(state.files).toEqual(mockFiles);
      expect(state.selectedIndex).toBe(1);
      expect(state.currentDir).toBe("C:\\test");
    });

    it("should merge with existing state", () => {
      const { setFileState } = useFileStore.getState();

      // Set initial state
      setFileState(panelId, tabId, {
        files: mockFiles,
        selectedIndex: 0,
        currentDir: "C:\\test",
        sortKey: "name",
        sortOrder: "asc",
      });

      // Update partial state
      setFileState(panelId, tabId, {
        selectedIndex: 1,
        sortKey: "size",
      });

      const state = useFileStore.getState().fileStates[panelId][tabId];
      expect(state.files).toEqual(mockFiles); // Unchanged
      expect(state.selectedIndex).toBe(1); // Updated
      expect(state.currentDir).toBe("C:\\test"); // Unchanged
      expect(state.sortKey).toBe("size"); // Updated
      expect(state.sortOrder).toBe("asc"); // Unchanged
    });
  });

  describe("setSortKey", () => {
    it("should set sort key", () => {
      const { setSortKey } = useFileStore.getState();

      setSortKey(panelId, tabId, "modified");

      const state = useFileStore.getState().fileStates[panelId][tabId];
      expect(state.sortKey).toBe("modified");
    });

    it("should create state if it doesn't exist", () => {
      const { setSortKey } = useFileStore.getState();

      setSortKey("new-panel", "new-tab", "file_type");

      const state = useFileStore.getState().fileStates["new-panel"]["new-tab"];
      expect(state.sortKey).toBe("file_type");
    });
  });

  describe("setSortOrder", () => {
    it("should set sort order", () => {
      const { setSortOrder } = useFileStore.getState();

      setSortOrder(panelId, tabId, "desc");

      const state = useFileStore.getState().fileStates[panelId][tabId];
      expect(state.sortOrder).toBe("desc");
    });

    it("should create state if it doesn't exist", () => {
      const { setSortOrder } = useFileStore.getState();

      setSortOrder("new-panel", "new-tab", "desc");

      const state = useFileStore.getState().fileStates["new-panel"]["new-tab"];
      expect(state.sortOrder).toBe("desc");
    });
  });

  describe("loadDirectory", () => {
    it("should load directory and update state", async () => {
      const { loadDirectory } = useFileStore.getState();
      const path = "C:\\test";

      await loadDirectory(panelId, tabId, path);

      expect(readDirectory).toHaveBeenCalledWith(path);
      expect(dirname).toHaveBeenCalledWith(path);

      const state = useFileStore.getState().fileStates[panelId][tabId];

      // Should include parent directory entry (..) plus the mock files
      expect(state.files.length).toBe(mockFiles.length + 1);
      expect(state.files[0].name).toBe("..");
      expect(state.files[0].path).toBe("C:\\");
      expect(state.files[0].is_dir).toBe(true);

      expect(state.currentDir).toBe(path);
      expect(state.selectedIndex).toBe(-1);
      expect(state.sortKey).toBe("name");
      expect(state.sortOrder).toBe("asc");
    });

    it("should not add parent directory entry for root path", async () => {
      const { loadDirectory } = useFileStore.getState();
      const path = "C:\\";

      await loadDirectory(panelId, tabId, path);

      expect(readDirectory).toHaveBeenCalledWith(path);

      const state = useFileStore.getState().fileStates[panelId][tabId];

      // Should only include the mock files without parent entry
      expect(state.files.length).toBe(mockFiles.length);
      expect(state.files[0].name).toBe(mockFiles[0].name);
    });

    it("should handle errors when loading directory", async () => {
      const { loadDirectory } = useFileStore.getState();
      const path = "C:\\invalid\\path";

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      (readDirectory as any).mockRejectedValue(
        new Error("Failed to read directory")
      );

      await loadDirectory(panelId, tabId, path);

      expect(readDirectory).toHaveBeenCalledWith(path);
      expect(consoleErrorSpy).toHaveBeenCalled();

      // State should not be updated on error
      const state = useFileStore.getState().fileStates[panelId]?.[tabId];
      expect(state).toBeUndefined();

      consoleErrorSpy.mockRestore();
    });
  });
});
