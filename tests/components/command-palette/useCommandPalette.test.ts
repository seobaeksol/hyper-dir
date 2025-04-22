import { describe, it, expect } from "vitest";
import useCommandPalette from "@/components/command-palette/useCommandPalette";
import { renderHook } from "@testing-library/react";

describe("useCommandPalette", () => {
  it("should initialize state", () => {
    const { result } = renderHook(() => useCommandPalette());
    expect(result.current.query).toBeDefined();
  });
  // TODO: Add tests for state updates, command filtering, and selection
});
