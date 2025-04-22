import { getDefaultCommands } from "@/commands/commandList";
import { describe, it, expect } from "vitest";

describe("commandList", () => {
  it("should export a list of commands", () => {
    expect(getDefaultCommands()).toBeDefined();
  });
  // TODO: Add tests for each command definition and edge case
});
