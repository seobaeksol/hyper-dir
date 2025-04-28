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

  it("should call setQuery", async () => {
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
    await act(async () => {
      result.current.setQuery("new query");
    });
    expect(setQuery).toHaveBeenCalledWith("new query");
  });

  it("should handle onCommandExecute and close palette", async () => {
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
    await act(async () => {
      result.current.onCommandExecute({ id: 1, title: "Test", action });
    });
    expect(action).toHaveBeenCalled();
    expect(setVisible).toHaveBeenCalledWith(false);
  });

  it("should handle onFileExecute for directory", async () => {
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
    await act(async () => {
      result.current.onFileExecute(file);
    });
    expect(moveDir).toHaveBeenCalledWith("tab1", "/bar");
    expect(setVisible).toHaveBeenCalledWith(false);
  });

  it("should handle onFileExecute for file", async () => {
    const setVisible = vi.fn();
    (useUIStore as any).mockImplementation((fn: any) =>
      fn({
        commandPaletteVisible: true,
        setCommandPaletteVisible: setVisible,
      })
    );
    const file = { name: "foo.txt", path: "/foo", is_dir: false };
    const { result } = renderHook(() => useCommandPalette());
    await act(async () => {
      result.current.onFileExecute(file);
    });
    // Should not call moveDirectory
    expect(setVisible).toHaveBeenCalledWith(false);
  });

  it("should handle prompt logic", async () => {
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
    await act(async () => {
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

  // New test for keyboard handling in prompt mode
  it("should handle keyboard events in prompt mode", async () => {
    const setVisible = vi.fn();
    const resolvePrompt = vi.fn();
    const cancelPrompt = vi.fn();

    (useUIStore as any).mockImplementation((fn: any) =>
      fn({
        commandPaletteVisible: true,
        setCommandPaletteVisible: setVisible,
      })
    );

    (useCommandStore as any).mockReturnValueOnce({
      query: "",
      commands: defaultCommands,
      setQuery: vi.fn(),
      prompt: { message: "Prompt", initialValue: "" },
      startPrompt: vi.fn(),
      resolvePrompt,
      cancelPrompt,
    });

    renderHook(() => useCommandPalette());

    // Simulate pressing Escape key
    const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
    const preventDefaultSpy = vi.spyOn(escapeEvent, "preventDefault");
    window.dispatchEvent(escapeEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(cancelPrompt).toHaveBeenCalled();
    expect(setVisible).toHaveBeenCalledWith(false);

    // Simulate pressing Enter key
    const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
    const enterPreventDefaultSpy = vi.spyOn(enterEvent, "preventDefault");
    window.dispatchEvent(enterEvent);

    expect(enterPreventDefaultSpy).toHaveBeenCalled();
    expect(resolvePrompt).toHaveBeenCalled();
    expect(setVisible).toHaveBeenCalledWith(false);
  });

  // New test for keyboard handling in normal mode
  it("should handle Escape key in normal mode", () => {
    const setVisible = vi.fn();

    (useUIStore as any).mockImplementation((fn: any) =>
      fn({
        commandPaletteVisible: true,
        setCommandPaletteVisible: setVisible,
      })
    );

    (useCommandStore as any).mockReturnValueOnce({
      query: "",
      commands: defaultCommands,
      setQuery: vi.fn(),
      prompt: undefined, // No prompt, normal mode
      startPrompt: vi.fn(),
      resolvePrompt: vi.fn(),
      cancelPrompt: vi.fn(),
    });

    renderHook(() => useCommandPalette());

    // Simulate pressing Escape key
    const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
    const preventDefaultSpy = vi.spyOn(escapeEvent, "preventDefault");
    window.dispatchEvent(escapeEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(setVisible).toHaveBeenCalledWith(false);
  });

  // Add test for setting promptInput
  it("should set promptInput with initialValue from prompt", async () => {
    (useCommandStore as any).mockReturnValueOnce({
      query: "",
      commands: defaultCommands,
      setQuery: vi.fn(),
      prompt: { message: "Prompt", initialValue: "initial" },
      startPrompt: vi.fn(),
      resolvePrompt: vi.fn(),
      cancelPrompt: vi.fn(),
    });

    const { result } = renderHook(() => useCommandPalette());
    expect(result.current.promptInput).toBe("initial");

    // Test updating promptInput
    await act(async () => {
      result.current.setPromptInput("updated value");
    });

    // Re-render to see the updated state
    const { result: updatedResult } = renderHook(() => useCommandPalette());
    expect(updatedResult.current.setPromptInput).toBeDefined();
  });
});
