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
  files: [
    { name: "main.rs", path: "/main.rs", isDir: false },
    {
      name: "Sidebar.tsx",
      path: "/src/components/layout/Sidebar.tsx",
      isDir: false,
    },
    { name: "App.tsx", path: "/src/App.tsx", isDir: false },
  ],
  selectedIndex: 0,
  setFiles: (files) => set({ files }),
  setCurrentDir: (path) => set({ currentDir: path }),
  setSelectedIndex: (index) => set({ selectedIndex: index }),
}));
