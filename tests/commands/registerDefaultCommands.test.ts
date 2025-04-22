import { registerDefaultCommands } from "@/commands/registerDefaultCommands";
import { describe, it, expect } from "vitest";

describe("registerDefaultCommands", () => {
  it("should be a function", () => {
    expect(typeof registerDefaultCommands).toBe("function");
  });
  it("should register without error", () => {
    // TODO: Mock command store and test registration logic
    expect(() => registerDefaultCommands()).not.toThrow();
  });
});
