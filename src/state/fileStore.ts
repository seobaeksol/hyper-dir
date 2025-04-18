import { create } from "zustand";
import { dirname } from "@tauri-apps/api/path";
import { FileEntry, readDirectory } from "../ipc/fs";

interface FileState {
  currentDir: string;
  files: FileEntry[];
  selectedIndex: number;
  setFiles: (files: FileEntry[]) => void;
  setCurrentDir: (path: string) => void;
  setSelectedIndex: (index: number) => void;
  loadDirectory: (path: string) => Promise<void>;
}

export const useFileStore = create<FileState>((set) => ({
  currentDir: ".",
  files: [],
  selectedIndex: 0,
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
}));
