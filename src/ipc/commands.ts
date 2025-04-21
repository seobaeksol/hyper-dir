export const IPC_COMMANDS = {
  READ_DIRECTORY: "read_directory",
  CREATE_DIR: "create_directory",
  REMOVE_FILE_OR_DIRECTORY: "remove_file_or_directory",
  RENAME_FILE_OR_DIRECTORY: "rename_file_or_directory",
} as const;

export type IPCCommandKey = keyof typeof IPC_COMMANDS;
export type IPCCommandValue = (typeof IPC_COMMANDS)[IPCCommandKey];
