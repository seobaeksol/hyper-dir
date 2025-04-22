import { describe, it, expect } from "vitest";
import * as commandStore from "@/state/commandStore";

describe("state/commandStore", () => {
  it("should export command store", () => {
    expect(commandStore).toBeDefined();
  });
  // TODO: Add tests for command store logic and edge cases
});
