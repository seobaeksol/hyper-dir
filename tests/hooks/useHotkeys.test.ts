import { describe, it, expect } from "vitest";
import { useHotkeys } from "@/hooks/useHotkeys";
import { renderHook } from "@testing-library/react";

describe("useHotkeys", () => {
  it("should initialize without error", () => {
    const { result } = renderHook(() => useHotkeys());
    expect(result.current).toBeDefined();
  });
  // TODO: Add tests for hotkey registration and edge cases
});
