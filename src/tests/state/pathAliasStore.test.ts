import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { usePathAliases } from "@/state/pathAliasStore";
import { fetchPathAliases } from "@/ipc/alias";

// Mock fetchPathAliases
vi.mock("@/ipc/alias", () => ({
  fetchPathAliases: vi.fn(),
}));

describe("usePathAliases", () => {
  const appName = "hyper-dir";
  const mockAliases = {
    documents: "/User/test/Documents",
    downloads: "/User/test/Downloads",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with empty aliases and loading true", () => {
    (fetchPathAliases as any).mockResolvedValue(mockAliases);
    const { result } = renderHook(() => usePathAliases(appName));

    waitFor(() => {
      expect(result.current.aliases).toEqual({});
      expect(result.current.loading).toBe(true);
    });
  });

  it("should fetch and set aliases", async () => {
    (fetchPathAliases as any).mockResolvedValue(mockAliases);
    const { result } = renderHook(() => usePathAliases(appName));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.aliases).toEqual(mockAliases);
    });
  });

  it("should set loading to false even if fetch fails", async () => {
    (fetchPathAliases as any).mockRejectedValue(new Error("Failed to fetch"));
    const { result } = renderHook(() => usePathAliases(appName));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.aliases).toEqual({});
    });
  });

  it("should refetch when appName changes", async () => {
    (fetchPathAliases as any).mockResolvedValueOnce(mockAliases);
    const { result, rerender } = renderHook(
      ({ name }) => usePathAliases(name),
      { initialProps: { name: appName } }
    );
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.aliases).toEqual(mockAliases);
    });

    const newAliases = { home: "/User/test" };
    (fetchPathAliases as any).mockResolvedValueOnce(newAliases);
    rerender({ name: "another-app" });
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.aliases).toEqual(newAliases);
    });
  });
});
