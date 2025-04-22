import { registerDefaultCommands } from "@/commands/registerDefaultCommands";
import { getDefaultCommands } from "@/commands/commandList";
import { useCommandStore } from "@/state/commandStore";
import { describe, it, expect, beforeEach } from "vitest";

function getCurrentCommands() {
  return useCommandStore.getState().commands;
}

function setStoreCommands(cmds: any[]) {
  useCommandStore.getState().registerCommands(cmds);
}

describe("registerDefaultCommands", () => {
  beforeEach(() => {
    // Reset the command store before each test
    setStoreCommands([]);
  });

  it("should be a function", () => {
    expect(typeof registerDefaultCommands).toBe("function");
  });

  it("should register without error", () => {
    expect(() => registerDefaultCommands()).not.toThrow();
  });

  function stripActions(commands: any[]) {
    return commands.map(({ id, title, keywords }) => ({ id, title, keywords }));
  }

  it("should populate the command store with default commands", () => {
    expect(getCurrentCommands()).toEqual([]);
    registerDefaultCommands();
    const defaults = getDefaultCommands();
    expect(stripActions(getCurrentCommands())).toEqual(stripActions(defaults));
  });

  it("should overwrite any existing commands in the store", () => {
    const fake = [{ id: "fake", title: "Fake", action: () => {} }];
    setStoreCommands(fake);
    expect(stripActions(getCurrentCommands())).toEqual(stripActions(fake));
    registerDefaultCommands();
    expect(stripActions(getCurrentCommands())).toEqual(stripActions(getDefaultCommands()));
  });

  it("should be idempotent (calling multiple times does not duplicate)", () => {
    registerDefaultCommands();
    const first = stripActions(getCurrentCommands());
    registerDefaultCommands();
    const second = stripActions(getCurrentCommands());
    expect(second).toEqual(first);
    expect(second).toEqual(stripActions(getDefaultCommands()));
  });

  it("should register all expected command ids", () => {
    registerDefaultCommands();
    const ids = getCurrentCommands().map((c) => c.id);
    const expectedIds = getDefaultCommands().map((c) => c.id);
    for (const id of expectedIds) {
      expect(ids).toContain(id);
    }
  });

  it("should set a non-empty array after registration", () => {
    registerDefaultCommands();
    expect(Array.isArray(getCurrentCommands())).toBe(true);
    expect(getCurrentCommands().length).toBeGreaterThan(0);
  });
});
