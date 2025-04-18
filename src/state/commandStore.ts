// src/state/commandStore.ts
import { create } from "zustand";

export interface Command {
  id: string;
  title: string;
  keywords?: string[];
  action: () => void;
}

interface CommandState {
  query: string;
  commands: Command[];
  selectedIndex: number;
  setQuery: (q: string) => void;
  registerCommands: (cmds: Command[]) => void;
  selectNext: () => void;
  selectPrev: () => void;
  executeSelected: () => void;
}

export const useCommandStore = create<CommandState>((set, get) => ({
  query: "",
  commands: [],
  selectedIndex: 0,

  setQuery: (q) => set({ query: q, selectedIndex: 0 }),

  registerCommands: (cmds) => set({ commands: cmds }),

  selectNext: () => {
    const max = get().commands.length;
    set((s) => ({
      selectedIndex: (s.selectedIndex + 1) % max,
    }));
  },

  selectPrev: () => {
    const max = get().commands.length;
    set((s) => ({
      selectedIndex: (s.selectedIndex - 1 + max) % max,
    }));
  },

  executeSelected: () => {
    const { commands, selectedIndex } = get();
    commands[selectedIndex]?.action();
  },
}));
