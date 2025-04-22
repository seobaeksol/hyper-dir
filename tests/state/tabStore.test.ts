import { describe, it, expect } from "vitest";
import * as tabStore from "@/state/tabStore";

describe("state/tabStore", () => {
  it("should export tab store", () => {
    expect(tabStore).toBeDefined();
  });
  // TODO: Add tests for tab store logic and edge cases
});
