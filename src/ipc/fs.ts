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

export async function createDirectory(path: string): Promise<void> {
  return await invoke(IPC_COMMANDS.CREATE_DIR, { path });
}

export async function removeFileOrDirectory(path: string): Promise<void> {
  return await invoke(IPC_COMMANDS.REMOVE_FILE_OR_DIRECTORY, { path });
}

export async function renameFileOrDirectory(src: string, dst: string): Promise<void> {
  return await invoke(IPC_COMMANDS.RENAME_FILE_OR_DIRECTORY, { src, dst });
}
