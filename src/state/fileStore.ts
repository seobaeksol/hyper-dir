import { create } from "zustand";
import { FileEntry, readDirectory } from "../ipc/fs";
import { dirname } from "@tauri-apps/api/path";
import { usePanelStore } from "./panelStore";

export type SortKey = "name" | "file_type" | "size" | "modified";
export type SortOrder = "asc" | "desc";

type FileState = {
  files: FileEntry[];
  selectedIndex: number;
  currentDir: string;
  sortKey: SortKey;
  sortOrder: SortOrder;
};

type FileStore = {
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
  sortFiles: (panelId: string, tabId: string) => void;

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
    get().sortFiles(panelId, tabId);
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
    get().sortFiles(panelId, tabId);
  },

  sortFiles: (panelId, tabId) => {
    const { fileStates } = get();
    const { files, sortKey, sortOrder } = fileStates[panelId]?.[tabId];

    const sortedFiles = files.sort((a, b) => {
      // 1. ".." First
      if (a.name === "..") return -1;
      if (b.name === "..") return 1;

      // 2. Directory First
      if (sortKey !== "file_type" && a.is_dir && !b.is_dir) return -1;
      if (sortKey !== "file_type" && !a.is_dir && b.is_dir) return 1;

      // 3. Sort by key
      const va = a[sortKey] ?? 0;
      const vb = b[sortKey] ?? 0;

      if (typeof va === "string" && typeof vb === "string") {
        return sortOrder === "asc"
          ? va.localeCompare(vb)
          : vb.localeCompare(va);
      } else if (typeof va === "number" && typeof vb === "number") {
        return sortOrder === "asc" ? va - vb : vb - va;
      }

      return 0;
    });

    set((store) => ({
      fileStates: {
        ...store.fileStates,
        [panelId]: {
          ...store.fileStates[panelId],
          [tabId]: {
            ...store.fileStates[panelId]?.[tabId],
            files: sortedFiles,
          },
        },
      },
    }));
  },

  loadDirectory: async (panelId, tabId, path) => {
    try {
      const files = await readDirectory(path);

      let parentEntry: FileEntry | null = null;
      try {
        const parentPath = await dirname(path);

        parentEntry = {
          name: "..",
          path: parentPath,
          is_dir: true,
          size: 0,
          modified: 0,
          file_type: "folder",
        };
      } catch (error) {
        console.error("Failed to get parent directory:", error);
      }

      // Update tab title
      const panelStore = usePanelStore.getState();
      const tabTitle = path.split("/").pop() || path;
      panelStore.updateTabTitle(panelId, tabId, tabTitle);

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
