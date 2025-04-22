import { describe, it, expect } from "vitest";
import * as commands from "@/ipc/commands";

describe("ipc/commands", () => {
  it("should export commands", () => {
    expect(commands).toBeDefined();
  });
  // TODO: Add tests for command IPC logic
});
