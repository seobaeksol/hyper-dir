import { create } from "zustand";
import { dirname } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";

type FileEntry = {
  name: string;
  path: string;
  is_dir: boolean;
};

async function loadDirectory(path: string): Promise<FileEntry[]> {
  return await invoke("read_directory", { path });
}

export interface FileItem {
  name: string;
  path: string;
  isDir: boolean;
}

interface FileState {
  currentDir: string;
  files: FileItem[];
  selectedIndex: number;
  setFiles: (files: FileItem[]) => void;
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
      const entries = await loadDirectory(path);
      const mapped = entries.map((entry) => ({
        name: entry.name,
        path: entry.path,
        isDir: entry.is_dir,
      }));

      const parentPath = await dirname(path);
      const parentEntry = {
        name: "..",
        path: parentPath,
        isDir: true,
      };

      mapped.unshift(parentEntry);

      set({ currentDir: path, files: mapped, selectedIndex: 0 });
    } catch (error) {
      console.error(error);
    }
  },
}));
