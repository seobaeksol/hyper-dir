import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useCommandStore, Command } from "@/state/commandStore";
import { useUIStore } from "@/state/uiStore";

// Mock dependencies
vi.mock("@/state/uiStore", () => ({
  useUIStore: {
    getState: vi.fn().mockReturnValue({
      toggleCommandPalette: vi.fn(),
      setCommandPaletteVisible: vi.fn(),
    }),
  },
}));

describe("state/commandStore", () => {
  // Sample commands for testing
  const mockCommands: Command[] = [
    { id: "cmd1", title: "Command 1", action: vi.fn() },
    { id: "cmd2", title: "Command 2", action: vi.fn() },
    {
      id: "cmd3",
      title: "Command 3",
      keywords: ["key1", "key2"],
      action: vi.fn(),
    },
  ];

  // Reset the store between tests
  beforeEach(() => {
    vi.clearAllMocks();
    useCommandStore.setState({
      query: "",
      commands: [],
      selectedIndex: 0,
      prompt: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const state = useCommandStore.getState();

    expect(state.query).toBe("");
    expect(state.commands).toEqual([]);
    expect(state.selectedIndex).toBe(0);
    expect(state.prompt).toBeNull();
  });

  describe("query management", () => {
    it("should set query", () => {
      const { setQuery } = useCommandStore.getState();

      setQuery("test query");
      expect(useCommandStore.getState().query).toBe("test query");
      expect(useCommandStore.getState().selectedIndex).toBe(0);
    });
  });

  describe("command registration", () => {
    it("should register commands", () => {
      const { registerCommands } = useCommandStore.getState();

      registerCommands(mockCommands);
      expect(useCommandStore.getState().commands).toEqual(mockCommands);
    });
  });

  describe("command selection", () => {
    beforeEach(() => {
      useCommandStore.setState({ commands: mockCommands });
    });

    it("should select next command", () => {
      const { selectNext } = useCommandStore.getState();

      selectNext();
      expect(useCommandStore.getState().selectedIndex).toBe(1);

      selectNext();
      expect(useCommandStore.getState().selectedIndex).toBe(2);

      selectNext();
      expect(useCommandStore.getState().selectedIndex).toBe(0); // Wraps around
    });

    it("should select previous command", () => {
      const { selectPrev } = useCommandStore.getState();

      selectPrev();
      expect(useCommandStore.getState().selectedIndex).toBe(2); // Wraps around from 0 to last

      selectPrev();
      expect(useCommandStore.getState().selectedIndex).toBe(1);
    });

    it("should execute selected command", () => {
      const { executeSelected } = useCommandStore.getState();

      useCommandStore.setState({ selectedIndex: 1 });
      executeSelected();

      expect(mockCommands[1].action).toHaveBeenCalled();
    });

    it("should not throw when no commands exist", () => {
      useCommandStore.setState({ commands: [], selectedIndex: 0 });
      const { executeSelected } = useCommandStore.getState();

      expect(() => executeSelected()).not.toThrow();
    });
  });

  describe("command palette mode", () => {
    it("should set mode", () => {
      const { setMode } = useCommandStore.getState();

      setMode("command");
      expect(useCommandStore.getState().query).toBe("> ");

      setMode("search");
      expect(useCommandStore.getState().query).toBe("");
    });

    it("should open command mode", () => {
      const { openCommandMode } = useCommandStore.getState();
      const setCommandPaletteVisible =
        useUIStore.getState().setCommandPaletteVisible;

      openCommandMode();

      expect(useCommandStore.getState().query).toBe("> ");
      expect(setCommandPaletteVisible).toHaveBeenCalledWith(true);
    });

    it("should open search mode", () => {
      const { openSearchMode } = useCommandStore.getState();
      const setCommandPaletteVisible =
        useUIStore.getState().setCommandPaletteVisible;

      openSearchMode();

      expect(useCommandStore.getState().query).toBe("");
      expect(setCommandPaletteVisible).toHaveBeenCalledWith(true);
    });

    it("should detect command mode from query", () => {
      const { getMode } = useCommandStore.getState();

      useCommandStore.setState({ query: "> command" });
      expect(getMode()).toBe("command");

      useCommandStore.setState({ query: "search" });
      expect(getMode()).toBe("search");

      useCommandStore.setState({ query: "  > not command because of spaces" });
      expect(getMode()).toBe("search");
    });

    it("should toggle command palette", () => {
      const { toggleCommandPalette } = useCommandStore.getState();
      const uiToggleCommandPalette = useUIStore.getState().toggleCommandPalette;

      toggleCommandPalette("command");
      expect(useCommandStore.getState().query).toBe("> ");
      expect(uiToggleCommandPalette).toHaveBeenCalled();

      toggleCommandPalette("search");
      expect(useCommandStore.getState().query).toBe("");
      expect(uiToggleCommandPalette).toHaveBeenCalledTimes(2);
    });
  });

  describe("prompt handling", () => {
    it("should start a prompt", () => {
      const { startPrompt } = useCommandStore.getState();
      const mockPrompt = {
        message: "Test prompt",
        initialValue: "initial",
        onSubmit: vi.fn(),
        onCancel: vi.fn(),
      };

      startPrompt(mockPrompt);
      expect(useCommandStore.getState().prompt).toEqual(mockPrompt);
    });

    it("should resolve a prompt", () => {
      const onSubmit = vi.fn();
      useCommandStore.setState({
        prompt: {
          message: "Test prompt",
          onSubmit,
          onCancel: vi.fn(),
        },
      });

      const { resolvePrompt } = useCommandStore.getState();
      resolvePrompt("test value");

      expect(onSubmit).toHaveBeenCalledWith("test value");
      expect(useCommandStore.getState().prompt).toBeNull();
    });

    it("should cancel a prompt", () => {
      const onCancel = vi.fn();
      useCommandStore.setState({
        prompt: {
          message: "Test prompt",
          onSubmit: vi.fn(),
          onCancel,
        },
      });

      const { cancelPrompt } = useCommandStore.getState();
      cancelPrompt();

      expect(onCancel).toHaveBeenCalled();
      expect(useCommandStore.getState().prompt).toBeNull();
    });

    it("should handle cancel when no onCancel is provided", () => {
      useCommandStore.setState({
        prompt: {
          message: "Test prompt",
          onSubmit: vi.fn(),
        },
      });

      const { cancelPrompt } = useCommandStore.getState();

      expect(() => cancelPrompt()).not.toThrow();
      expect(useCommandStore.getState().prompt).toBeNull();
    });
  });
});
