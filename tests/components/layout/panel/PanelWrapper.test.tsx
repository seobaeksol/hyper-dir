import { act, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PanelWrapper } from "@/components/layout/panel/PanelWrapper";
import { usePanelStore } from "@/state/panelStore";

// Mock Panel component to check prop passing
vi.mock("@/components/layout/panel/Panel", () => ({
  Panel: ({ panelId }: { panelId: string }) => (
    <div data-testid={`mock-panel-${panelId}`}>Panel {panelId}</div>
  ),
}));

describe("PanelWrapper", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await act(async () => {
      usePanelStore.setState({ panels: [], activePanelId: "" });
    });
  });

  afterEach(async () => {
    await act(async () => {
      usePanelStore.setState({ panels: [], activePanelId: "" });
    });
  });

  it("renders nothing when there are no panels", async () => {
    await act(async () => {
      render(<PanelWrapper />);
    });
    expect(screen.queryByTestId(/mock-panel-/)).not.toBeInTheDocument();
  });

  it("renders a single panel", async () => {
    await act(async () => {
      usePanelStore.setState({
        panels: [
          { id: "p1", activeTabId: "t1", position: { row: 0, column: 0 } },
        ],
        activePanelId: "p1",
      });
      render(<PanelWrapper />);
    });
    expect(screen.getByTestId("mock-panel-p1")).toBeInTheDocument();
  });

  it("renders multiple panels", async () => {
    await act(async () => {
      usePanelStore.setState({
        panels: [
          { id: "p1", activeTabId: "t1", position: { row: 0, column: 0 } },
          { id: "p2", activeTabId: "t2", position: { row: 0, column: 1 } },
        ],
        activePanelId: "p2",
      });
      render(<PanelWrapper />);
    });
    expect(screen.getByTestId("mock-panel-p1")).toBeInTheDocument();
    expect(screen.getByTestId("mock-panel-p2")).toBeInTheDocument();
  });

  it("applies the active panel class correctly", async () => {
    await act(async () => {
      usePanelStore.setState({
        panels: [
          { id: "p1", activeTabId: "t1", position: { row: 0, column: 0 } },
          { id: "p2", activeTabId: "t2", position: { row: 0, column: 1 } },
        ],
        activePanelId: "p2",
      });
      render(<PanelWrapper />);
    });

    // The actual PanelWrapper renders <div> for each panel, but we mock Panel as a <div>. So, check for background classes on parent divs.
    const containers = document.querySelectorAll(".flex.flex-col.flex-1");
    expect(containers.length).toBe(2);
    expect(containers[0].className).toContain("bg-zinc-900/20");
    expect(containers[1].className).toContain("bg-zinc-900/50");
  });

  it("moves active panel from p1 to p2", async () => {
    await act(async () => {
      usePanelStore.setState({
        panels: [
          { id: "p1", activeTabId: "t1", position: { row: 0, column: 0 } },
          { id: "p2", activeTabId: "t2", position: { row: 0, column: 1 } },
        ],
        activePanelId: "p1",
      });
    });
    const { rerender } = render(<PanelWrapper />);

    let containers = document.querySelectorAll(".flex.flex-col.flex-1");
    expect(containers[0].className).toContain("bg-zinc-900/50");
    expect(containers[1].className).toContain("bg-zinc-900/20");
    // Change active panel to p2
    await act(async () => {
      usePanelStore.setState({
        panels: [
          { id: "p1", activeTabId: "t1", position: { row: 0, column: 0 } },
          { id: "p2", activeTabId: "t2", position: { row: 0, column: 1 } },
        ],
        activePanelId: "p2",
      });
    });
    rerender(<PanelWrapper />);
    containers = document.querySelectorAll(".flex.flex-col.flex-1");
    expect(containers[0].className).toContain("bg-zinc-900/20");
    expect(containers[1].className).toContain("bg-zinc-900/50");
  });

  it("moves active panel from p2 to p1", async () => {
    await act(async () => {
      usePanelStore.setState({
        panels: [
          { id: "p1", activeTabId: "t1", position: { row: 0, column: 0 } },
          { id: "p2", activeTabId: "t2", position: { row: 0, column: 1 } },
        ],
        activePanelId: "p2",
      });
    });

    const { rerender } = render(<PanelWrapper />);

    let containers = document.querySelectorAll(".flex.flex-col.flex-1");
    expect(containers[0].className).toContain("bg-zinc-900/20");
    expect(containers[1].className).toContain("bg-zinc-900/50");

    await act(async () => {
      usePanelStore.setState({
        panels: [
          { id: "p1", activeTabId: "t1", position: { row: 0, column: 0 } },
          { id: "p2", activeTabId: "t2", position: { row: 0, column: 1 } },
        ],
        activePanelId: "p1",
      });
    });

    rerender(<PanelWrapper />);

    containers = document.querySelectorAll(".flex.flex-col.flex-1");
    expect(containers[0].className).toContain("bg-zinc-900/50");
    expect(containers[1].className).toContain("bg-zinc-900/20");
  });

  it("renders correct structure (snapshot)", () => {
    usePanelStore.setState({
      panels: [
        { id: "p1", activeTabId: "t1", position: { row: 0, column: 0 } },
      ],
      activePanelId: "p1",
    });
    const { container } = render(<PanelWrapper />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
