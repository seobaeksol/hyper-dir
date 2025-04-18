import { create } from "zustand";
import { dirname } from "@tauri-apps/api/path";
import { FileEntry, readDirectory } from "../ipc/fs";

export type SortKey = "name" | "file_type" | "size" | "modified";
export type SortOrder = "asc" | "desc";

interface FileState {
  currentDir: string;
  rawFiles: FileEntry[];
  files: FileEntry[]; // sorted files
  selectedIndex: number;
  sortKey: SortKey;
  sortOrder: SortOrder;
  setFiles: (files: FileEntry[]) => void;
  setCurrentDir: (path: string) => void;
  setSelectedIndex: (index: number) => void;
  setSortKey: (key: SortKey) => void;
  setSortOrder: (order: SortOrder) => void;
  loadDirectory: (path: string) => Promise<void>;
  sortFiles: () => void;
}

export const useFileStore = create<FileState>((set, get) => ({
  currentDir: ".",
  rawFiles: [],
  files: [],
  selectedIndex: 0,
  sortKey: "name",
  sortOrder: "asc",
  setFiles: (files) => {
    set({ rawFiles: files });
    get().sortFiles();
  },
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

      set({ currentDir: path, selectedIndex: 0 });
      get().setFiles(entries);
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
    get().sortFiles();
  },
  setSortOrder: (order) => {
    set({ sortOrder: order });
    get().sortFiles();
  },
  sortFiles: () => {
    const { rawFiles, sortKey, sortOrder } = get();

    const sortedFiles = rawFiles.sort((a, b) => {
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

    set({ files: sortedFiles });
  },
}));
