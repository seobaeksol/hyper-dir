import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useSidebarController } from "@/hooks/useSidebarController";
import { renderHook, act } from "@testing-library/react";
import { useUIStore } from "@/state/uiStore";

// Mock the useUIStore
vi.mock("@/state/uiStore", () => ({
  useUIStore: vi.fn(),
}));

describe("useSidebarController", () => {
  const mockedSetSidebarVisible = vi.fn();
  const mockedToggleSidebar = vi.fn();
  const mockedSetActiveTab = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation for useUIStore
    (useUIStore as any).mockImplementation((selector: (state: any) => any) => {
      const state = {
        sidebar: {
          left: { display: false, activeTabId: "explorer" },
          right: { display: true, activeTabId: "config" },
        },
      };
      return selector(state);
    });

    // Mock the getState().functions
    (useUIStore.getState as any) = vi.fn().mockReturnValue({
      setSidebarVisible: mockedSetSidebarVisible,
      toggleSidebar: mockedToggleSidebar,
      setActiveTab: mockedSetActiveTab,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should initialize and provide controller", () => {
    const { result } = renderHook(() => useSidebarController("left"));
    expect(result.current).toBeDefined();
    expect(result.current.display).toBe(false);
    expect(result.current.activeTabId).toBe("explorer");
  });

  it("should return different values for left and right sidebars", () => {
    const { result: leftResult } = renderHook(() =>
      useSidebarController("left")
    );
    const { result: rightResult } = renderHook(() =>
      useSidebarController("right")
    );

    expect(leftResult.current.display).toBe(false);
    expect(leftResult.current.activeTabId).toBe("explorer");

    expect(rightResult.current.display).toBe(true);
    expect(rightResult.current.activeTabId).toBe("config");
  });

  it("should call setSidebarVisible when setVisible is called", () => {
    const { result } = renderHook(() => useSidebarController("left"));

    act(() => {
      result.current.setVisible(true);
    });

    expect(mockedSetSidebarVisible).toHaveBeenCalledWith("left", true);
  });

  it("should call toggleSidebar when toggle is called", () => {
    const { result } = renderHook(() => useSidebarController("right"));

    act(() => {
      result.current.toggle();
    });

    expect(mockedToggleSidebar).toHaveBeenCalledWith("right");
  });

  it("should call setActiveTab when setActiveTab is called", () => {
    const { result } = renderHook(() => useSidebarController("left"));

    act(() => {
      result.current.setActiveTab("search");
    });

    expect(mockedSetActiveTab).toHaveBeenCalledWith("left", "search");
  });
});
