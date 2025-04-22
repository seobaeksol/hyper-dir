import { describe, it, expect } from "vitest";
import { useSidebarController } from "@/hooks/useSidebarController";
import { renderHook } from "@testing-library/react";

describe("useSidebarController", () => {
  it("should initialize and provide controller", () => {
    const { result } = renderHook(() => useSidebarController());
    expect(result.current).toBeDefined();
  });
  // TODO: Add tests for sidebar open/close/toggle
});
