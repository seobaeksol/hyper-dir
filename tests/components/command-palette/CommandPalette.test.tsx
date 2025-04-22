import { render, fireEvent, screen } from "@testing-library/react";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { describe, it, vi, beforeEach, expect } from "vitest";

// Mock the useCommandPalette hook
vi.mock("@/components/command-palette/useCommandPalette", () => ({
  __esModule: true,
  default: vi.fn(),
}));
import useCommandPalette from "@/components/command-palette/useCommandPalette";

describe("CommandPalette", () => {
  const baseMock = {
    visible: true,
    prompt: undefined,
    mode: "command",
    query: "",
    setQuery: vi.fn(),
    promptInput: undefined,
    setPromptInput: vi.fn(),
    commands: [
      { id: 1, title: "Test Command", action: vi.fn() },
      { id: 2, title: "Another Command", action: vi.fn() },
    ],
    files: [
      { name: "file1.txt", is_dir: false },
      { name: "folder", is_dir: true },
    ],
    onCommandExecute: vi.fn(),
    onFileExecute: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when not visible", () => {
    (useCommandPalette as any).mockReturnValue({ ...baseMock, visible: false });
    const { container } = render(<CommandPalette />);
    expect(container.firstChild).toBeNull();
  });

  it("renders command mode with CommandResultList", () => {
    (useCommandPalette as any).mockReturnValue({ ...baseMock, mode: "command" });
    render(<CommandPalette />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText("Test Command")).toBeInTheDocument();
    expect(screen.getByText("Another Command")).toBeInTheDocument();
  });

  it("renders file mode with FileSearchResultList", () => {
    (useCommandPalette as any).mockReturnValue({ ...baseMock, mode: "search" });
    render(<CommandPalette />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText("file1.txt")).toBeInTheDocument();
    expect(screen.getByText("folder")).toBeInTheDocument();
  });

  it("renders prompt mode with prompt message and input", () => {
    const prompt = { message: "Prompt message", initialValue: "init" };
    (useCommandPalette as any).mockReturnValue({ ...baseMock, prompt, promptInput: "foo" });
    render(<CommandPalette />);
    expect(screen.getByText("Prompt message")).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("foo");
    expect(input).toHaveAttribute("placeholder", "init");
  });

  it("calls setQuery when typing in normal mode", () => {
    const setQuery = vi.fn();
    (useCommandPalette as any).mockReturnValue({ ...baseMock, setQuery });
    render(<CommandPalette />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "typed" } });
    expect(setQuery).toHaveBeenCalledWith("typed");
  });

  it("calls setPromptInput when typing in prompt mode", () => {
    const setPromptInput = vi.fn();
    const prompt = { message: "Prompt!", initialValue: "" };
    (useCommandPalette as any).mockReturnValue({ ...baseMock, prompt, promptInput: "", setPromptInput });
    render(<CommandPalette />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "bar" } });
    expect(setPromptInput).toHaveBeenCalledWith("bar");
  });

  it("calls onCommandExecute when clicking a command", () => {
    const onCommandExecute = vi.fn();
    (useCommandPalette as any).mockReturnValue({ ...baseMock, onCommandExecute });
    render(<CommandPalette />);
    fireEvent.click(screen.getByText("Test Command"));
    expect(onCommandExecute).toHaveBeenCalledWith(baseMock.commands[0]);
  });

  it("calls onFileExecute when clicking a file", () => {
    const onFileExecute = vi.fn();
    (useCommandPalette as any).mockReturnValue({ ...baseMock, mode: "search", onFileExecute });
    render(<CommandPalette />);
    fireEvent.click(screen.getByText("file1.txt"));
    expect(onFileExecute).toHaveBeenCalledWith(baseMock.files[0]);
  });

  it("does not render CommandResultList or FileSearchResultList in prompt mode", () => {
    const prompt = { message: "Prompt!", initialValue: "" };
    (useCommandPalette as any).mockReturnValue({ ...baseMock, prompt });
    render(<CommandPalette />);
    expect(screen.queryByText("Test Command")).not.toBeInTheDocument();
    expect(screen.queryByText("file1.txt")).not.toBeInTheDocument();
  });
});
