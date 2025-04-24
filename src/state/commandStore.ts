// src/state/commandStore.ts
import { create } from "zustand";
import { useUIStore } from "./uiStore";

type CommandPaletteMode = "command" | "search";

export interface Command {
  id: string;
  title: string;
  keywords?: string[];
  action: () => void;
}

interface CommandPrompt {
  message: string;
  initialValue?: string;
  onSubmit: (value: string) => void;
  onCancel?: () => void;
}

interface CommandState {
  query: string;
  commands: Command[];
  selectedIndex: number;
  setQuery: (q: string) => void;
  registerCommands: (cmds: Command[]) => void;
  setMode: (m: CommandPaletteMode) => void;
  openCommandMode: () => void;
  openSearchMode: () => void;
  toggleCommandPalette: (mode: CommandPaletteMode) => void;
  selectNext: () => void;
  selectPrev: () => void;
  executeSelected: () => void;
  getMode: () => CommandPaletteMode;
  prompt: CommandPrompt | null;
  startPrompt: (prompt: CommandPrompt) => void;
  resolvePrompt: (value: string) => void;
  cancelPrompt: () => void;
}

export const useCommandStore = create<CommandState>((set, get) => ({
  mode: "search",
  query: "",
  commands: [],
  selectedIndex: 0,
  prompt: null,

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

  setMode: (mode) => set({ query: mode === "command" ? "> " : "" }),

  openCommandMode: () => {
    set({ query: "> " });
    useUIStore.getState().setCommandPaletteVisible(true);
  },

  openSearchMode: () => {
    set({ query: "" });
    useUIStore.getState().setCommandPaletteVisible(true);
  },

  getMode: () => {
    const q = get().query;
    return q.startsWith(">") ? "command" : "search";
  },

  toggleCommandPalette: (mode: CommandPaletteMode) => {
    set({ query: mode === "command" ? "> " : "" });
    useUIStore.getState().toggleCommandPalette();
  },

  startPrompt: (prompt) => set({ prompt }),
  resolvePrompt: (value) => {
    const p = get().prompt;
    if (p) {
      p.onSubmit(value);
      set({ prompt: null });
    }
  },
  cancelPrompt: () => {
    const p = get().prompt;
    if (p && p.onCancel) p.onCancel();
    set({ prompt: null });
  },
}));
