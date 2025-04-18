import { invoke } from "@tauri-apps/api/core";
import { IPC_COMMANDS } from "./commands";

export interface FileEntry {
  name: string;
  path: string;
  is_dir: boolean;
}

export async function readDirectory(path: string): Promise<FileEntry[]> {
  return await invoke(IPC_COMMANDS.READ_DIRECTORY, { path });
}
