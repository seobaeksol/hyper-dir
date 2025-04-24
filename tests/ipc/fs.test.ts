import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "@/ipc/fs";
import { invoke } from "@tauri-apps/api/core";
import { IPC_COMMANDS } from "@/ipc/commands";

// Mock the invoke function
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

describe("ipc/fs", () => {
  const mockFileEntries = [
    {
      name: "file1.txt",
      path: "/mock/path/file1.txt",
      is_dir: false,
      size: 1234,
      modified: 1713775552,
      file_type: "txt",
    },
    {
      name: "folder1",
      path: "/mock/path/folder1",
      is_dir: true,
      file_type: "dir",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should export fs functions", () => {
    expect(fs.readDirectory).toBeDefined();
    expect(fs.createDirectory).toBeDefined();
    expect(fs.removeFileOrDirectory).toBeDefined();
    expect(fs.renameFileOrDirectory).toBeDefined();
  });

  describe("readDirectory", () => {
    it("should call the invoke function with correct parameters", async () => {
      (invoke as any).mockResolvedValue(mockFileEntries);

      const path = "/test/path";
      const result = await fs.readDirectory(path);

      expect(invoke).toHaveBeenCalledWith(IPC_COMMANDS.READ_DIRECTORY, {
        path,
      });
      expect(result).toEqual(mockFileEntries);
    });

    it("should handle errors correctly", async () => {
      const error = new Error("Failed to read directory");
      (invoke as any).mockRejectedValue(error);

      const path = "/invalid/path";

      await expect(fs.readDirectory(path)).rejects.toThrow(
        "Failed to read directory"
      );
      expect(invoke).toHaveBeenCalledWith(IPC_COMMANDS.READ_DIRECTORY, {
        path,
      });
    });
  });

  describe("createDirectory", () => {
    it("should call the invoke function with correct parameters", async () => {
      (invoke as any).mockResolvedValue(undefined);

      const path = "/test/new-dir";
      await fs.createDirectory(path);

      expect(invoke).toHaveBeenCalledWith(IPC_COMMANDS.CREATE_DIR, { path });
    });

    it("should handle errors correctly", async () => {
      const error = new Error("Failed to create directory");
      (invoke as any).mockRejectedValue(error);

      const path = "/invalid/path";

      await expect(fs.createDirectory(path)).rejects.toThrow(
        "Failed to create directory"
      );
      expect(invoke).toHaveBeenCalledWith(IPC_COMMANDS.CREATE_DIR, { path });
    });
  });

  describe("removeFileOrDirectory", () => {
    it("should call the invoke function with correct parameters", async () => {
      (invoke as any).mockResolvedValue(undefined);

      const path = "/test/file-to-remove.txt";
      await fs.removeFileOrDirectory(path);

      expect(invoke).toHaveBeenCalledWith(
        IPC_COMMANDS.REMOVE_FILE_OR_DIRECTORY,
        { path }
      );
    });

    it("should handle errors correctly", async () => {
      const error = new Error("Failed to remove file or directory");
      (invoke as any).mockRejectedValue(error);

      const path = "/invalid/path";

      await expect(fs.removeFileOrDirectory(path)).rejects.toThrow(
        "Failed to remove file or directory"
      );
      expect(invoke).toHaveBeenCalledWith(
        IPC_COMMANDS.REMOVE_FILE_OR_DIRECTORY,
        { path }
      );
    });
  });

  describe("renameFileOrDirectory", () => {
    it("should call the invoke function with correct parameters", async () => {
      (invoke as any).mockResolvedValue(undefined);

      const src = "/test/old-name.txt";
      const dst = "/test/new-name.txt";
      await fs.renameFileOrDirectory(src, dst);

      expect(invoke).toHaveBeenCalledWith(
        IPC_COMMANDS.RENAME_FILE_OR_DIRECTORY,
        { src, dst }
      );
    });

    it("should handle errors correctly", async () => {
      const error = new Error("Failed to rename file or directory");
      (invoke as any).mockRejectedValue(error);

      const src = "/invalid/source";
      const dst = "/invalid/destination";

      await expect(fs.renameFileOrDirectory(src, dst)).rejects.toThrow(
        "Failed to rename file or directory"
      );
      expect(invoke).toHaveBeenCalledWith(
        IPC_COMMANDS.RENAME_FILE_OR_DIRECTORY,
        { src, dst }
      );
    });
  });
});
