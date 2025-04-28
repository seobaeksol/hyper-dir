import { describe, it, expect } from "vitest";
import * as commands from "@/ipc/commands";

describe("ipc/commands", () => {
  it("should export commands constants", () => {
    expect(commands.IPC_COMMANDS).toBeDefined();
  });

  it("should define all expected command keys", () => {
    expect(commands.IPC_COMMANDS.READ_DIRECTORY).toBeDefined();
    expect(commands.IPC_COMMANDS.CREATE_DIR).toBeDefined();
    expect(commands.IPC_COMMANDS.REMOVE_FILE_OR_DIRECTORY).toBeDefined();
    expect(commands.IPC_COMMANDS.RENAME_FILE_OR_DIRECTORY).toBeDefined();
  });

  it("should have correct command values", () => {
    expect(commands.IPC_COMMANDS.READ_DIRECTORY).toBe("read_directory");
    expect(commands.IPC_COMMANDS.CREATE_DIR).toBe("create_directory");
    expect(commands.IPC_COMMANDS.REMOVE_FILE_OR_DIRECTORY).toBe(
      "remove_file_or_directory"
    );
    expect(commands.IPC_COMMANDS.RENAME_FILE_OR_DIRECTORY).toBe(
      "rename_file_or_directory"
    );
  });

  it("should export command type definitions", () => {
    expect(typeof commands.IPC_COMMANDS).toBe("object");

    // This test is a type check - it verifies the TypeScript types are exported
    const testType = (
      key: commands.IPCCommandKey
    ): commands.IPCCommandValue => {
      return commands.IPC_COMMANDS[key];
    };

    expect(testType("READ_DIRECTORY")).toBe("read_directory");
  });
});
