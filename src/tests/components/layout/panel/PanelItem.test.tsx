import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PanelItem } from "@/components/layout/panel/PanelItem";
import { FileEntry } from "@/ipc/fs";

const mockFile: FileEntry = {
  name: "test.txt",
  is_dir: false,
  file_type: "txt",
  size: 1024,
  modified: 1713769200,
  path: "",
};

describe("PanelItem", () => {
  it("renders file name and type correctly", () => {
    render(<PanelItem file={mockFile} selected={false} onClick={() => {}} />);
    expect(screen.getByText(/test.txt/)).toBeInTheDocument();
    // There may be multiple 'txt', so ensure at least one exists
    expect(screen.getAllByText(/txt/).length).toBeGreaterThan(0);
    expect(screen.getByText(/1.0 KB/)).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<PanelItem file={mockFile} selected={false} onClick={onClick} />);
    fireEvent.click(screen.getByText(/test.txt/));
    expect(onClick).toHaveBeenCalled();
  });
});
