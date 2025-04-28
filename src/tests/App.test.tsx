import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "@/App";
import { useHotkeys } from "@/hooks/useHotkeys";
import { initializeApp } from "@/state/actions";
import { useUIStore } from "@/state/uiStore";

// Mock all dependencies
vi.mock("@/hooks/useHotkeys", () => ({
  useHotkeys: vi.fn(),
}));

vi.mock("@/state/actions", () => ({
  initializeApp: vi.fn(),
}));

// Mock all components
vi.mock("@/components/layout/Titlebar", () => ({
  Titlebar: () => <div data-testid="mock-titlebar">Mock Titlebar</div>,
}));

vi.mock("@/components/layout/sidebar/Sidebar", () => ({
  Sidebar: ({ position }: { position: string }) => (
    <div data-testid={`mock-sidebar-${position}`}>Mock Sidebar {position}</div>
  ),
}));

vi.mock("@/components/layout/Statusbar", () => ({
  Statusbar: () => <div data-testid="mock-statusbar">Mock Statusbar</div>,
}));

vi.mock("@/components/layout/panel/PanelWrapper", () => ({
  PanelWrapper: () => (
    <div data-testid="mock-panel-wrapper">Mock Panel Wrapper</div>
  ),
}));

vi.mock("@/components/command-palette/CommandPalette", () => ({
  CommandPalette: () => (
    <div data-testid="mock-command-palette">Mock Command Palette</div>
  ),
}));

vi.mock("@tauri-apps/api/path", () => ({
  dirname: vi.fn(async () => "/mock/path"),
}));

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

// Mock useUIStore for sidebar visibility tests
vi.mock("@/state/uiStore", () => ({
  useUIStore: vi.fn().mockImplementation((selector) => {
    return selector({
      sidebar: {
        left: { display: true, activeTabId: "explorer" },
        right: { display: false, activeTabId: "config" },
      },
      commandPaletteVisible: false,
    });
  }),
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders without crashing", () => {
    render(<App />);

    // Verify all main components are rendered
    expect(screen.getByTestId("mock-titlebar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-sidebar-left")).toBeInTheDocument();
    expect(screen.getByTestId("mock-sidebar-right")).toBeInTheDocument();
    expect(screen.getByTestId("mock-panel-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("mock-statusbar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-command-palette")).toBeInTheDocument();
  });

  it("initializes the app on first render", () => {
    render(<App />);

    waitFor(() => {
      expect(initializeApp).toHaveBeenCalledTimes(1);
    });

    // Rendering again should not call initializeApp again due to the once wrapper
    render(<App />);

    waitFor(() => {
      expect(initializeApp).toHaveBeenCalledTimes(1);
    });
  });

  it("sets up hotkeys", () => {
    render(<App />);
    expect(useHotkeys).toHaveBeenCalled();
  });

  it("renders left sidebar when visible", () => {
    // Left sidebar is visible by default in our mock
    render(<App />);

    const leftSidebar = screen.getByTestId("mock-sidebar-left");
    expect(leftSidebar).toBeInTheDocument();
    expect(leftSidebar).toBeVisible();
  });

  it("renders right sidebar when visible", () => {
    // Make right sidebar visible
    (useUIStore as any).mockImplementation((selector: (state: any) => any) => {
      return selector({
        sidebar: {
          left: { display: true, activeTabId: "explorer" },
          right: { display: true, activeTabId: "config" },
        },
        commandPaletteVisible: false,
      });
    });

    render(<App />);

    const rightSidebar = screen.getByTestId("mock-sidebar-right");
    expect(rightSidebar).toBeInTheDocument();
    expect(rightSidebar).toBeVisible();
  });

  it("renders command palette", () => {
    render(<App />);

    const commandPalette = screen.getByTestId("mock-command-palette");
    expect(commandPalette).toBeInTheDocument();
  });

  it("renders with proper layout structure", () => {
    const { container } = render(<App />);

    // Check if the main container has the expected classes
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass(
      "flex",
      "flex-col",
      "h-screen",
      "w-screen",
      "overflow-hidden",
      "bg-zinc-950"
    );

    // Check the middle section with sidebars and panels has flex layout
    const middleSection = container.querySelector(
      ".flex.flex-1.overflow-hidden"
    );
    expect(middleSection).toBeInTheDocument();
  });
});
