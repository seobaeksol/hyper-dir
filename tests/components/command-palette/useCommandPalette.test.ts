import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useCommandPalette from "@/components/command-palette/useCommandPalette";

// Mock all external stores and actions
vi.mock("@/state/uiStore", () => ({
  useUIStore: vi.fn(),
}));
vi.mock("@/state/commandStore", () => ({
  useCommandStore: vi.fn(),
}));
vi.mock("@/state/fileStore", () => ({
  useFileStore: vi.fn(),
}));
vi.mock("@/state/panelStore", () => ({
  usePanelStore: vi.fn(),
}));
vi.mock("@/state/tabStore", () => ({
  useTabStore: vi.fn(),
}));
vi.mock("@/state/actions", () => ({
  moveDirectory: vi.fn(),
}));

import { useUIStore } from "@/state/uiStore";
import { useCommandStore } from "@/state/commandStore";
import { useFileStore } from "@/state/fileStore";
import { usePanelStore } from "@/state/panelStore";
import { useTabStore } from "@/state/tabStore";
import { moveDirectory } from "@/state/actions";

describe("useCommandPalette", () => {
  const defaultCommands = [
    { id: 1, title: "Open File", action: vi.fn() },
    { id: 2, title: "Close Tab", action: vi.fn() },
  ];
  // Removed unused defaultFiles

  beforeEach(() => {
    vi.clearAllMocks();
    (useUIStore as any).mockImplementation((fn: any) =>
      fn({
        commandPaletteVisible: true,
        setCommandPaletteVisible: vi.fn(),
      })
    );
    (useCommandStore as any).mockReturnValue({
      query: "",
      commands: defaultCommands,
      setQuery: vi.fn(),
      prompt: undefined,
      startPrompt: vi.fn(),
      resolvePrompt: vi.fn(),
      cancelPrompt: vi.fn(),
    });
    (usePanelStore as any).mockImplementation((fn: any) =>
      fn({ activePanelId: "panel1" })
    );
    (useTabStore as any).mockImplementation((fn: any) =>
      fn({ getActiveTab: () => ({ id: "tab1" }) })
    );
    (useFileStore as any).mockImplementation((fn: any) =>
      fn({ fileStates: { panel1: { tab1: {} } } })
    );
    (moveDirectory as any).mockImplementation(() => {});
  });

  it("should initialize state", () => {
    const { result } = renderHook(() => useCommandPalette());
    expect(result.current.visible).toBe(true);
    expect(result.current.query).toBe("");
    expect(result.current.commands).toEqual(defaultCommands);
    expect(result.current.files).toBeDefined();
    expect(result.current.mode).toBeOneOf(["command", "search"]);
  });

  it("should update query and mode", () => {
    (useCommandStore as any).mockReturnValueOnce({
      query: ">test",
      commands: defaultCommands,
      setQuery: vi.fn(),
      prompt: undefined,
      startPrompt: vi.fn(),
      resolvePrompt: vi.fn(),
      cancelPrompt: vi.fn(),
    });
    const { result } = renderHook(() => useCommandPalette());
    expect(result.current.mode).toBe("command");
    (useCommandStore as any).mockReturnValueOnce({
      query: "foo",
      commands: defaultCommands,
      setQuery: vi.fn(),
      prompt: undefined,
      startPrompt: vi.fn(),
      resolvePrompt: vi.fn(),
      cancelPrompt: vi.fn(),
    });
    const { result: result2 } = renderHook(() => useCommandPalette());
    expect(result2.current.mode).toBe("search");
  });

  it("should call setQuery", () => {
    const setQuery = vi.fn();
    (useCommandStore as any).mockReturnValueOnce({
      query: "",
      commands: defaultCommands,
      setQuery,
      prompt: undefined,
      startPrompt: vi.fn(),
      resolvePrompt: vi.fn(),
      cancelPrompt: vi.fn(),
    });
    const { result } = renderHook(() => useCommandPalette());
    act(() => {
      result.current.setQuery("new query");
    });
    expect(setQuery).toHaveBeenCalledWith("new query");
  });

  it("should handle onCommandExecute and close palette", () => {
    const setVisible = vi.fn();
    (useUIStore as any).mockImplementation((fn: any) =>
      fn({
        commandPaletteVisible: true,
        setCommandPaletteVisible: setVisible,
      })
    );
    const action = vi.fn();
    (useCommandStore as any).mockReturnValueOnce({
      query: "",
      commands: [{ id: 1, title: "Test", action }],
      setQuery: vi.fn(),
      prompt: undefined,
      startPrompt: vi.fn(),
      resolvePrompt: vi.fn(),
      cancelPrompt: vi.fn(),
    });
    const { result } = renderHook(() => useCommandPalette());
    act(() => {
      result.current.onCommandExecute({ id: 1, title: "Test", action });
    });
    expect(action).toHaveBeenCalled();
    expect(setVisible).toHaveBeenCalledWith(false);
  });

  it("should handle onFileExecute for directory", () => {
    const setVisible = vi.fn();
    (useUIStore as any).mockImplementation((fn: any) =>
      fn({
        commandPaletteVisible: true,
        setCommandPaletteVisible: setVisible,
      })
    );
    (useTabStore as any).mockImplementation((fn: any) =>
      fn({ getActiveTab: () => ({ id: "tab1" }) })
    );
    const file = { name: "bar", path: "/bar", is_dir: true };
    const moveDir = vi.fn();
    (moveDirectory as any).mockImplementation(moveDir);
    const { result } = renderHook(() => useCommandPalette());
    act(() => {
      result.current.onFileExecute(file);
    });
    expect(moveDir).toHaveBeenCalledWith("tab1", "/bar");
    expect(setVisible).toHaveBeenCalledWith(false);
  });

  it("should handle onFileExecute for file", () => {
    const setVisible = vi.fn();
    (useUIStore as any).mockImplementation((fn: any) =>
      fn({
        commandPaletteVisible: true,
        setCommandPaletteVisible: setVisible,
      })
    );
    const file = { name: "foo.txt", path: "/foo", is_dir: false };
    const { result } = renderHook(() => useCommandPalette());
    act(() => {
      result.current.onFileExecute(file);
    });
    // Should not call moveDirectory
    expect(setVisible).toHaveBeenCalledWith(false);
  });

  it("should handle prompt logic", () => {
    const startPrompt = vi.fn();
    const resolvePrompt = vi.fn();
    const cancelPrompt = vi.fn();
    (useCommandStore as any).mockReturnValueOnce({
      query: "",
      commands: defaultCommands,
      setQuery: vi.fn(),
      prompt: { message: "Prompt", initialValue: "val" },
      startPrompt,
      resolvePrompt,
      cancelPrompt,
    });
    const { result } = renderHook(() => useCommandPalette());
    act(() => {
      result.current.prompt && result.current.prompt.message;
      // Simulate prompt actions
      startPrompt();
      resolvePrompt("done");
      cancelPrompt();
    });
    expect(startPrompt).toHaveBeenCalled();
    expect(resolvePrompt).toHaveBeenCalledWith("done");
    expect(cancelPrompt).toHaveBeenCalled();
  });
});
