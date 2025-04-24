import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SidebarTab } from "@/components/layout/sidebar/SidebarTab";

describe("SidebarTab", () => {
  it("renders without crashing", () => {
    render(<SidebarTab icon="📁" active={false} onClick={() => {}} />);
  });

  it("renders the icon correctly", () => {
    render(<SidebarTab icon="📁" active={false} onClick={() => {}} />);
    expect(screen.getByText("📁")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<SidebarTab icon="📁" active={false} onClick={onClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies active styling when active prop is true", () => {
    render(<SidebarTab icon="📁" active={true} onClick={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-zinc-600");
  });

  it("does not apply active styling when active prop is false", () => {
    render(<SidebarTab icon="📁" active={false} onClick={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).not.toHaveClass("bg-zinc-600");
  });

  it("is accessible via keyboard", () => {
    const onClick = vi.fn();
    render(<SidebarTab icon="📁" active={false} onClick={onClick} />);

    const button = screen.getByRole("button");
    button.focus();
    expect(button).toHaveFocus();

    fireEvent.keyDown(button, { key: "Enter" });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("has correct base styling", () => {
    render(<SidebarTab icon="📁" active={false} onClick={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "w-8",
      "h-8",
      "text-lg",
      "flex",
      "items-center",
      "justify-center",
      "rounded",
      "hover:bg-zinc-700"
    );
  });
});
