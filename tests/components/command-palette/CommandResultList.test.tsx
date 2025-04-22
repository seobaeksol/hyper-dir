import { render, fireEvent, screen } from "@testing-library/react";
import { CommandResultList } from "@/components/command-palette/CommandResultList";
import { describe, it, vi, beforeEach, expect, beforeAll } from "vitest";

describe("CommandResultList", () => {
  const commands = [
    { id: 1, title: "Test Command" },
    { id: 2, title: "Another Command" },
    { id: 3, title: "third" },
  ];

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with results", () => {
    render(
      <CommandResultList
        query=""
        commands={commands}
        onCommandExecute={() => {}}
      />
    );
    expect(screen.getByText("Test Command")).toBeInTheDocument();
    expect(screen.getByText("Another Command")).toBeInTheDocument();
    expect(screen.getByText("third")).toBeInTheDocument();
  });

  it("renders empty when no results", () => {
    render(
      <CommandResultList
        query="zzz"
        commands={commands}
        onCommandExecute={() => {}}
      />
    );
    expect(screen.queryByText("Test Command")).not.toBeInTheDocument();
    expect(screen.queryByText("Another Command")).not.toBeInTheDocument();
    expect(screen.queryByText("third")).not.toBeInTheDocument();
    // Should still render the <ul>
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("filters results by query (case-insensitive, ignores >)", () => {
    render(
      <CommandResultList
        query=">test"
        commands={commands}
        onCommandExecute={() => {}}
      />
    );
    expect(screen.getByText("Test Command")).toBeInTheDocument();
    expect(screen.queryByText("Another Command")).not.toBeInTheDocument();
  });

  it("calls onCommandExecute when clicking a result", () => {
    const onCommandExecute = vi.fn();
    render(
      <CommandResultList
        query=""
        commands={commands}
        onCommandExecute={onCommandExecute}
      />
    );
    fireEvent.click(screen.getByText("Another Command"));
    expect(onCommandExecute).toHaveBeenCalledWith(commands[1]);
  });

  it("highlights the selected item on mouse hover and removes on mouse leave", () => {
    render(
      <CommandResultList
        query=""
        commands={commands}
        onCommandExecute={() => {}}
      />
    );
    const item = screen.getByText("Another Command");
    fireEvent.mouseEnter(item);
    expect(item.className).toMatch(/bg-zinc-700/);
    fireEvent.mouseLeave(item);
    expect(item.className).not.toMatch(/bg-zinc-700/);
  });

  it("keyboard navigation: ArrowDown/ArrowUp changes selection, Enter triggers onCommandExecute", () => {
    const onCommandExecute = vi.fn();
    render(
      <CommandResultList
        query=""
        commands={commands}
        onCommandExecute={onCommandExecute}
      />
    );
    // ArrowDown selects first item
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(screen.getByText("Test Command").className).toMatch(/bg-zinc-700/);
    // ArrowDown again selects second
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(screen.getByText("Another Command").className).toMatch(
      /bg-zinc-700/
    );
    // ArrowUp goes back to first
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(screen.getByText("Test Command").className).toMatch(/bg-zinc-700/);
    // Enter triggers onCommandExecute
    fireEvent.keyDown(window, { key: "Enter" });
    expect(onCommandExecute).toHaveBeenCalledWith(commands[0]);
  });

  it("does not crash if onCommandExecute is not provided", () => {
    render(<CommandResultList query="" commands={commands} />);
    fireEvent.click(screen.getByText("Test Command"));
    fireEvent.keyDown(window, { key: "ArrowDown" });
    fireEvent.keyDown(window, { key: "Enter" });
    // No error thrown
    expect(true).toBe(true);
  });
});
