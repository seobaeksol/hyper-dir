import { render, fireEvent, screen } from "@testing-library/react";
import { FileSearchResultList } from "@/components/command-palette/FileSearchResultList";
import { describe, it, vi, beforeEach, beforeAll, expect } from "vitest";

describe("FileSearchResultList", () => {
  const files = [
    { path: "/foo", name: "foo.txt", is_dir: false },
    { path: "/bar", name: "bar", is_dir: true },
    { path: "/baz", name: "baz.md", is_dir: false },
  ];

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders file and directory results with correct text", () => {
    render(
      <FileSearchResultList query="" files={files} onFileExecute={() => {}} />
    );
    expect(screen.getByText("foo.txt")).toBeInTheDocument();
    expect(screen.getByText("bar")).toBeInTheDocument();
    expect(screen.getByText("baz.md")).toBeInTheDocument();
  });

  it("renders empty when no results", () => {
    render(
      <FileSearchResultList query="zzz" files={files} onFileExecute={() => {}} />
    );
    expect(screen.queryByText("foo.txt")).not.toBeInTheDocument();
    expect(screen.queryByText("bar")).not.toBeInTheDocument();
    expect(screen.queryByText("baz.md")).not.toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("filters results by query (case-insensitive)", () => {
    render(
      <FileSearchResultList query="foo" files={files} onFileExecute={() => {}} />
    );
    expect(screen.getByText("foo.txt")).toBeInTheDocument();
    expect(screen.queryByText("bar")).not.toBeInTheDocument();
  });

  it("shows correct icon for file and directory", () => {
    render(
      <FileSearchResultList query="" files={files} onFileExecute={() => {}} />
    );
    // Directory icon
    const dirIcon = screen.getByTitle("Directory");
    expect(dirIcon).toBeInTheDocument();
    // File icon
    const fileIcon = screen.getAllByTitle("File");
    expect(fileIcon.length).toBeGreaterThan(0);
  });

  it("calls onFileExecute when clicking a result", () => {
    const onFileExecute = vi.fn();
    render(
      <FileSearchResultList query="" files={files} onFileExecute={onFileExecute} />
    );
    fireEvent.click(screen.getByText("bar"));
    expect(onFileExecute).toHaveBeenCalledWith(files[1]);
  });

  it("highlights the selected item on mouse hover and removes on mouse leave", () => {
    render(
      <FileSearchResultList query="" files={files} onFileExecute={() => {}} />
    );
    const item = screen.getByText("bar");
    fireEvent.mouseEnter(item);
    expect(item.parentElement?.className).toMatch(/bg-zinc-700/);
    fireEvent.mouseLeave(item);
    expect(item.parentElement?.className).not.toMatch(/bg-zinc-700/);
  });

  it("keyboard navigation: ArrowDown/ArrowUp changes selection, Enter triggers onFileExecute", () => {
    const onFileExecute = vi.fn();
    render(
      <FileSearchResultList query="" files={files} onFileExecute={onFileExecute} />
    );
    // ArrowDown selects first item
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(screen.getByText("foo.txt").parentElement?.className).toMatch(/bg-zinc-700/);
    // ArrowDown again selects second
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(screen.getByText("bar").parentElement?.className).toMatch(/bg-zinc-700/);
    // ArrowUp goes back to first
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(screen.getByText("foo.txt").parentElement?.className).toMatch(/bg-zinc-700/);
    // Enter triggers onFileExecute
    fireEvent.keyDown(window, { key: "Enter" });
    expect(onFileExecute).toHaveBeenCalledWith(files[0]);
  });

  it("does not crash if onFileExecute is not provided", () => {
    render(<FileSearchResultList query="" files={files} />);
    fireEvent.click(screen.getByText("foo.txt"));
    fireEvent.keyDown(window, { key: "ArrowDown" });
    fireEvent.keyDown(window, { key: "Enter" });
    expect(true).toBe(true);
  });
});
