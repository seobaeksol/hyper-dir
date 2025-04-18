import { create } from "zustand";
import { dirname } from "@tauri-apps/api/path";
import { FileEntry, readDirectory } from "../ipc/fs";

export type SortKey = "name" | "file_type" | "size" | "modified";
export type SortOrder = "asc" | "desc";

interface FileState {
  currentDir: string;
  files: FileEntry[];
  selectedIndex: number;
  sortKey: SortKey;
  sortOrder: SortOrder;
  setFiles: (files: FileEntry[]) => void;
  setCurrentDir: (path: string) => void;
  setSelectedIndex: (index: number) => void;
  setSortKey: (key: SortKey) => void;
  setSortOrder: (order: SortOrder) => void;
  loadDirectory: (path: string) => Promise<void>;
}

export const useFileStore = create<FileState>((set) => ({
  currentDir: ".",
  files: [],
  selectedIndex: 0,
  sortKey: "name",
  sortOrder: "asc",
  setFiles: (files) => set({ files }),
  setCurrentDir: (path) => set({ currentDir: path }),
  setSelectedIndex: (index) => set({ selectedIndex: index }),
  loadDirectory: async (path) => {
    try {
      const entries = await readDirectory(path);
      const parentPath = await dirname(path);

      const parentEntry = {
        name: "..",
        path: parentPath,
        is_dir: true,
        size: 0,
        modified: 0,
        file_type: "folder",
      };

      entries.unshift(parentEntry);

      set({ currentDir: path, files: entries, selectedIndex: 0 });
    } catch (error) {
      console.error(error);
    }
  },
  setSortKey: (key) => {
    set((state) => {
      const isSameKey = state.sortKey === key;
      const newOrder = isSameKey && state.sortOrder === "asc" ? "desc" : "asc";
      return {
        sortKey: key,
        sortOrder: newOrder,
      };
    });
  },
  setSortOrder: (order) => set({ sortOrder: order }),
}));
