// src/commands/registerDefaultCommands.ts
import { useCommandStore } from "@/state/commandStore";
import { getDefaultCommands } from "./commandList";

export function registerDefaultCommands() {
  const commands = getDefaultCommands();
  useCommandStore.getState().registerCommands(commands);
}
