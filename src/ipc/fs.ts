import { invoke } from "@tauri-apps/api/core";
import { IPC_COMMANDS } from "./commands";

export interface FileEntry {
  name: string;
  path: string;
  is_dir: boolean;
  size?: number;
  modified?: number; // UNIX timestamp
  file_type: string;
}

export async function readDirectory(path: string): Promise<FileEntry[]> {
  return await invoke(IPC_COMMANDS.READ_DIRECTORY, { path });
}
