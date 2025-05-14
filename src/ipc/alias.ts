import { invoke } from "@tauri-apps/api/core";

export async function fetchPathAliases(
  appName: string
): Promise<Record<string, string>> {
  return await invoke<Record<string, string>>("get_path_aliases", { appName });
}
