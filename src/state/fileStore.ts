import { create } from "zustand";
import { FileEntry, readDirectory } from "../ipc/fs";
import { dirname } from "@tauri-apps/api/path";

export type SortKey = "name" | "file_type" | "size" | "modified";
export type SortOrder = "asc" | "desc";

interface FileState {
  files: FileEntry[];
  selectedIndex: number;
  currentDir: string;
  sortKey: SortKey;
  sortOrder: SortOrder;
};

interface FileStore {
  // Store file states using panel ID and tab ID as keys
  fileStates: Record<string, Record<string, FileState>>;

  // Return file state for currently active panel and tab
  getCurrentFileState: (panelId: string, tabId: string) => FileState;

  // Set file state
  setFileState: (
    panelId: string,
    tabId: string,
    state: Partial<FileState>
  ) => void;

  setSortKey: (panelId: string, tabId: string, sortKey: SortKey) => void;
  setSortOrder: (panelId: string, tabId: string, sortOrder: SortOrder) => void;

  // Load directory
  loadDirectory: (
    panelId: string,
    tabId: string,
    path: string
  ) => Promise<void>;
};

export const useFileStore = create<FileStore>((set, get) => ({
  fileStates: {},

  getCurrentFileState: (panelId, tabId) => {
    const state = get().fileStates[panelId]?.[tabId];
    return (
      state || {
        files: [],
        selectedIndex: -1,
        currentDir: "",
        sortKey: "name",
        sortOrder: "asc",
      }
    );
  },

  setFileState: (panelId, tabId, state) => {
    set((store) => ({
      fileStates: {
        ...store.fileStates,
        [panelId]: {
          ...store.fileStates[panelId],
          [tabId]: {
            ...store.fileStates[panelId]?.[tabId],
            ...state,
          },
        },
      },
    }));
  },

  setSortKey: (panelId, tabId, sortKey) => {
    set((store) => ({
      fileStates: {
        ...store.fileStates,
        [panelId]: {
          ...store.fileStates[panelId],
          [tabId]: {
            ...store.fileStates[panelId]?.[tabId],
            sortKey,
          },
        },
      },
    }));
  },

  setSortOrder: (panelId, tabId, sortOrder) => {
    set((store) => ({
      fileStates: {
        ...store.fileStates,
        [panelId]: {
          ...store.fileStates[panelId],
          [tabId]: {
            ...store.fileStates[panelId]?.[tabId],
            sortOrder,
          },
        },
      },
    }));
  },

  loadDirectory: async (panelId, tabId, path) => {
    try {
      const files = await readDirectory(path);

      let parentEntry: FileEntry | null = null;

      // Only add parent directory entry if not at root
      if (path !== "C:\\") {
        const parentPath = await dirname(path);

        parentEntry = {
          name: "..",
          path: parentPath,
          is_dir: true,
          size: 0,
          modified: 0,
          file_type: "folder",
        };
      }

      set((store) => ({
        fileStates: {
          ...store.fileStates,
          [panelId]: {
            ...store.fileStates[panelId],
            [tabId]: {
              files: parentEntry ? [parentEntry, ...files] : files,
              selectedIndex: -1,
              currentDir: path,
              sortKey: "name",
              sortOrder: "asc",
            },
          },
        },
      }));
    } catch (error) {
      console.error("Failed to load directory:", error);
    }
  },
}));
