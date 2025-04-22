import { getDefaultCommands } from "@/commands/commandList";
import { describe, it, expect } from "vitest";

describe("commandList", () => {
  const commands = getDefaultCommands();

  it("should export a non-empty array of commands", () => {
    expect(Array.isArray(commands)).toBe(true);
    expect(commands.length).toBeGreaterThan(0);
  });

  it("should have required properties for each command", () => {
    for (const cmd of commands) {
      expect(typeof cmd.id).toBe("string");
      expect(cmd.id.length).toBeGreaterThan(0);
      expect(typeof cmd.title).toBe("string");
      expect(cmd.title.length).toBeGreaterThan(0);
      expect(typeof cmd.action).toBe("function");
    }
  });

  it("should have unique command ids", () => {
    const ids = commands.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should contain all known command ids", () => {
    const knownIds = [
      "open-folder",
      "toggle-left-sidebar",
      "toggle-right-sidebar",
      "create-panel",
      "close-panel",
      "focus-panel-up",
      "focus-panel-down",
      "focus-panel-left",
      "focus-panel-right",
    ];
    const ids = commands.map((c) => c.id);
    for (const id of knownIds) {
      expect(ids).toContain(id);
    }
  });

  it("should have actions that do not throw when called (smoke test)", () => {
    for (const cmd of commands) {
      expect(() => {
        // Some actions may depend on store state, so we just check for no throw
        cmd.action();
      }).not.toThrow();
    }
  });

  it("should handle optional keywords property correctly", () => {
    for (const cmd of commands) {
      if (cmd.keywords !== undefined) {
        expect(Array.isArray(cmd.keywords)).toBe(true);
        for (const kw of cmd.keywords) {
          expect(typeof kw).toBe("string");
        }
      }
    }
  });
});
