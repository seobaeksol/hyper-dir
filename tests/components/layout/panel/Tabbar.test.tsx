import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Tabbar } from "@/components/layout/panel/Tabbar";
import { Tab, useTabStore } from "@/state/tabStore";
import { usePanelStore } from "@/state/panelStore";
import { IPC_COMMANDS } from "@/ipc/commands";

// Mock useTabStore
const panelId = "p1";
const panelId2 = "p2";
const mockTabs: Record<string, Tab[]> = {
  [panelId]: [
    { id: "p1-t1", path: "C:/foo", title: "foo", isActive: true },
    { id: "p1-t2", path: "C:/bar", title: "bar", isActive: false },
  ],
  [panelId2]: [
    { id: "p2-t2", path: "C:/bar", title: "foo", isActive: false },
    { id: "p2-t3", path: "C:/bar", title: "bar", isActive: true },
  ],
};

const tabActiveClass = "bg-zinc-700 text-white border-b-2 border-zinc-500";
const tabInactiveClass =
  "bg-zinc-900 text-zinc-400 hover:bg-zinc-700 border-b-2 border-zinc-900";

vi.mock("@tauri-apps/api/path", () => ({
  dirname: vi.fn(async () => "/mock/path"),
}));

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(async (cmd, args) => {
    switch (cmd) {
      case IPC_COMMANDS.READ_DIRECTORY:
        return [
          {
            name: "fileA.txt",
            path: "/mock/path/fileA.txt",
            is_dir: false,
            size: 1234,
            modified: 1713775552,
            file_type: "file",
          },
          {
            name: "folderB",
            path: "/mock/path/folderB",
            is_dir: true,
            file_type: "dir",
          },
        ];
      case IPC_COMMANDS.CREATE_DIR:
        return;
      case IPC_COMMANDS.REMOVE_FILE_OR_DIRECTORY:
        return;
      case IPC_COMMANDS.RENAME_FILE_OR_DIRECTORY:
        return;
    }
  }),
}));

// Mock fs functions to prevent real invoke calls
vi.mock("@/ipc/fs", () => ({
  readDirectory: vi.fn(async () => [
    {
      name: "fileA.txt",
      path: "/mock/path/fileA.txt",
      is_dir: false,
      size: 1234,
      modified: 1713775552,
      file_type: "file",
    },
    {
      name: "folderB",
      path: "/mock/path/folderB",
      is_dir: true,
      file_type: "dir",
    },
  ]),
  createDirectory: vi.fn(async () => {}),
  removeFileOrDirectory: vi.fn(async () => {}),
  renameFileOrDirectory: vi.fn(async () => {}),
}));

describe("Tabbar", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await act(async () => {
      useTabStore.setState({ tabs: {} });
    });
  });

  it("renders no tabs when empty", () => {
    render(<Tabbar panelId={panelId} />);
    expect(screen.getByTestId("tabbar")).toBeInTheDocument();
    expect(screen.queryByText("foo")).not.toBeInTheDocument();
  });

  it("renders a single tab", async () => {
    await act(async () => {
      useTabStore.setState({ tabs: { [panelId]: mockTabs[panelId] } });
    });
    render(<Tabbar panelId={panelId} />);
    expect(screen.getByText("foo")).toBeInTheDocument();
  });

  it("renders multiple tabs and highlights the active one", async () => {
    await act(async () => {
      useTabStore.setState({ tabs: mockTabs });
    });
    render(<Tabbar panelId={panelId} />);
    const tab1 = screen.getByText(mockTabs[panelId][0].title).closest("div");
    const tab2 = screen.getByText(mockTabs[panelId][1].title).closest("div");
    expect(tab1?.className).toContain(tabActiveClass);
    expect(tab2?.className).toContain(tabInactiveClass);
  });

  it("switches tab on click (t1 -> t2)", async () => {
    await act(async () => {
      useTabStore.setState({ tabs: mockTabs });
    });

    render(<Tabbar panelId={panelId} />);

    await act(async () => {
      fireEvent.click(screen.getByText(mockTabs[panelId][1].title));
    });

    const tab1 = screen.getByText(mockTabs[panelId][0].title).closest("div");
    const tab2 = screen.getByText(mockTabs[panelId][1].title).closest("div");

    expect(tab1?.className).toContain(tabInactiveClass);
    expect(tab2?.className).toContain(tabActiveClass);
  });

  it("switches tab on click (t2 -> t1)", async () => {
    await act(async () => {
      useTabStore.setState({ tabs: mockTabs });
    });

    render(<Tabbar panelId={panelId2} />);

    await act(async () => {
      fireEvent.click(screen.getByText(mockTabs[panelId2][0].title));
    });

    const tab1 = screen.getByText(mockTabs[panelId2][0].title).closest("div");
    const tab2 = screen.getByText(mockTabs[panelId2][1].title).closest("div");

    expect(tab1?.className).toContain(tabActiveClass);
    expect(tab2?.className).toContain(tabInactiveClass);
  });

  it("closes tab on close button click", async () => {
    await act(async () => {
      useTabStore.setState({ tabs: mockTabs });
    });

    render(<Tabbar panelId={panelId} />);

    const closeButtons = screen.getAllByRole("button", { name: "✕" });

    await act(async () => {
      fireEvent.click(closeButtons[0]);
    });

    // Check that the tab is removed from the DOM
    const tab1 = screen.queryByText(mockTabs[panelId][0].title);
    expect(tab1).toBeNull();

    // Check that the remaining tab is active
    const tab2 = screen.getByText(mockTabs[panelId][1].title).closest("div");
    expect(tab2).toBeInTheDocument();
    expect(tab2?.className).toContain(tabActiveClass);
  });

  it("adds a tab on plus button click", async () => {
    await act(async () => {
      useTabStore.setState({ tabs: mockTabs });
      usePanelStore.setState({
        panels: [
          { id: panelId, activeTabId: "t1", position: { row: 0, column: 0 } },
        ],
        activePanelId: panelId,
      });
    });

    render(<Tabbar panelId={panelId} />);

    await act(async () => {
      fireEvent.click(screen.getByText("+"));
    });

    const tab3 = screen.getAllByText(mockTabs[panelId][0].title);
    expect(tab3).toHaveLength(2);
  });

  it("renders correct structure (snapshot)", () => {
    const { container } = render(<Tabbar panelId={panelId} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
