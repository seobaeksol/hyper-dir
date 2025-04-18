export const IPC_COMMANDS = {
  READ_DIRECTORY: "read_directory",
  // CREATE_DIR: "create_directory",
  // REMOVE_FILE: "remove_file",
  // etc.
} as const;

export type IPCCommandKey = keyof typeof IPC_COMMANDS;
export type IPCCommandValue = (typeof IPC_COMMANDS)[IPCCommandKey];
