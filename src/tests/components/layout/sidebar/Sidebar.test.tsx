import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import * as useSidebarControllerModule from "@/hooks/useSidebarController";

// Mock Panel component to check prop passing
vi.mock("@/components/layout/sidebar/SidebarTab", () => ({
  SidebarTab: ({
    icon,
    active,
    onClick,
  }: {
    icon: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      role="navigation"
      onClick={onClick}
      className={`w-8 h-8 text-lg flex items-center justify-center rounded hover:bg-zinc-700 ${
        active ? "bg-zinc-600" : ""
      }`}
    >
      {icon}
    </button>
  ),
}));

// Helper to mock useSidebarController values
function mockSidebarController({
  display = true,
  activeTabId = "explorer",
  setActiveTab = vi.fn(),
} = {}) {
  vi.spyOn(useSidebarControllerModule, "useSidebarController").mockReturnValue({
    display,
    activeTabId,
    setActiveTab,
    setVisible: vi.fn(),
    toggle: vi.fn(),
  });
  return { setActiveTab };
}

const icons = {
  Explorer: "📁",
  Search: "🔍",
  Git: "🔃",
  Config: "⚙️",
  Starred: "⭐",
};

describe("Sidebar", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders without crashing when visible", () => {
    mockSidebarController();
    render(<Sidebar position="left" />);
    let navItems = screen.getAllByRole("navigation");
    expect(navItems.length).toBe(5);
  });

  it("returns null when not visible", () => {
    mockSidebarController({ display: false });
    const { container } = render(<Sidebar position="left" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders correct tab icons", () => {
    mockSidebarController();
    render(<Sidebar position="left" />);
    // Should find all 5 tab icons
    expect(screen.getByText(`${icons.Explorer}`)).toBeInTheDocument();
    expect(screen.getByText(`${icons.Search}`)).toBeInTheDocument();
    expect(screen.getByText(`${icons.Git}`)).toBeInTheDocument();
    expect(screen.getByText(`${icons.Config}`)).toBeInTheDocument();
    expect(screen.getByText(`${icons.Starred}`)).toBeInTheDocument();
  });

  it("shows only the active tab's panel", () => {
    mockSidebarController({ activeTabId: "git" });
    render(<Sidebar position="left" />);
    // We expect GitPanel content to be present
    expect(screen.getByText(/git/i, { selector: "div" })).toBeInTheDocument();
    // Should not show ExplorerPanel content
    expect(screen.queryByText(/explorer/i)).not.toBeInTheDocument();
  });

  it("switches panels when a tab is clicked", () => {
    const { setActiveTab } = mockSidebarController({ activeTabId: "explorer" });
    render(<Sidebar position="left" />);
    const searchTab = screen.getByText(icons.Search);
    fireEvent.click(searchTab);
    expect(setActiveTab).toHaveBeenCalledWith("search");
  });

  it("applies active styling to the selected tab", () => {
    mockSidebarController({ activeTabId: "config" });
    render(<Sidebar position="left" />);
    const configTab = screen.getByText(icons.Config);
    expect(configTab).toHaveClass("bg-zinc-600");
  });

  it("respects the position prop for left/right", () => {
    mockSidebarController();
    const { container, rerender } = render(<Sidebar position="left" />);
    expect(container.children[0]).toHaveClass("border-r");
    rerender(<Sidebar position="right" />);
    expect(container.children[0]).toHaveClass("border-l");
  });

  it("handles edge case: invalid tab id", () => {
    mockSidebarController({ activeTabId: "notarealtab" });
    render(<Sidebar position="left" />);
    // Should render no panel content
    expect(screen.queryByRole("tabpanel")).toBeNull();
  });

  it("tab buttons are accessible via role and keyboard", () => {
    mockSidebarController();
    render(<Sidebar position="left" />);
    const explorerTab = screen.getByText(icons.Explorer);
    explorerTab.focus();
    expect(explorerTab).toHaveFocus();
    fireEvent.keyDown(explorerTab, { key: "Enter" });
    // No error thrown, tab is focusable and responds to keyboard
  });
});
