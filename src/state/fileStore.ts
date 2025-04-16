// src/state/fileStore.ts
import { create } from "zustand";

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
}

export const useFileStore = create<FileState>((set) => ({
  currentDir: "/",
  files: [],
  selectedIndex: 0,
  setFiles: (files) => set({ files }),
  setCurrentDir: (path) => set({ currentDir: path }),
  setSelectedIndex: (index) => set({ selectedIndex: index }),
}));
