import { act, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { PanelFileList } from "@/components/layout/panel/PanelFileList";
import { useFileStore } from "@/state/fileStore";
import { useTabStore } from "@/state/tabStore";
import * as actions from "@/state/actions";
import { usePanelStore } from "@/state/panelStore";
import { FileEntry, readDirectory } from "@/ipc/fs";

// Mock dependencies
vi.mock("@tauri-apps/api/path", () => ({
  dirname: vi.fn(async () => "/mock/path"),
}));
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

vi.mock("@/components/layout/panel/PanelHeader", () => ({
  PanelHeader: vi.fn(
    ({
      panelId,
      tabId,
      sortKey,
      sortOrder,
    }: {
      panelId: string;
      tabId: string;
      sortKey: string;
      sortOrder: string;
    }) => (
      <div data-testid="mock-panel-header">
        <span
          data-testid={`mock-panel-header-${panelId}-${tabId}-${sortKey}-${sortOrder}`}
        >
          Mock Panel Header
        </span>
      </div>
    )
  ),
}));

vi.mock("@/components/layout/panel/PanelItem", () => ({
  PanelItem: vi.fn(
    ({ file, onClick }: { file: FileEntry; onClick: () => void }) => (
      <div data-testid={`mock-panel-item-${file.name}`} onClick={onClick}>
        <span>{file.name}</span>
      </div>
    )
  ),
}));

const defaultFiles: FileEntry[] = [
  {
    name: "..",
    path: "/parent",
    is_dir: true,
    size: 0,
    modified: 0,
    file_type: "dir",
  },
  {
    name: "dir1",
    path: "/dir1",
    is_dir: true,
    size: 0,
    modified: 0,
    file_type: "dir",
  },
  {
    name: "file1.txt",
    path: "/file1.txt",
    is_dir: false,
    size: 100,
    modified: 1713775552,
    file_type: "txt",
  },
];

// Mock fs functions to prevent real invoke calls
vi.mock("@/ipc/fs", () => ({
  readDirectory: vi.fn(async () => defaultFiles),
  createDirectory: vi.fn(async () => {}),
  removeFileOrDirectory: vi.fn(async () => {}),
  renameFileOrDirectory: vi.fn(async () => {}),
}));

vi.spyOn(actions, "moveDirectory");

describe("PanelFileList", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await act(async () => {
      usePanelStore.setState({
        panels: [
          { id: "p1", activeTabId: "tab1", position: { row: 0, column: 0 } },
        ],
        activePanelId: "p1",
      });

      useTabStore.setState({
        tabs: {
          p1: [
            { id: "tab1", path: "/path", title: "Mock Tab", isActive: true },
          ],
        },
      });

      useFileStore.setState({
        fileStates: {
          p1: {
            tab1: {
              currentDir: "/path",
              files: defaultFiles,
              selectedIndex: 0,
              sortKey: "name",
              sortOrder: "asc",
            },
          },
        },
      });
    });
  });

  afterEach(() => {});

  it("renders nothing if tab is not found", async () => {
    await act(async () => {
      render(<PanelFileList panelId="p1" tabId="t1" />);
    });
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("renders files and parent entry", async () => {
    // Setup panel, tab, and file state
    await act(async () => {
      usePanelStore.setState({
        panels: [
          {
            id: "p1",
            activeTabId: "tab1",
            position: { row: 0, column: 0 },
          },
        ],
        activePanelId: "p1",
      });

      useTabStore.setState({
        tabs: {
          p1: [
            { id: "tab1", path: "/mock", title: "Mock Tab", isActive: true },
          ],
        },
      });

      useFileStore.setState({
        fileStates: {
          p1: {
            tab1: {
              currentDir: "/mock",
              files: defaultFiles,
              selectedIndex: 1,
              sortKey: "name",
              sortOrder: "asc",
            },
          },
        },
      });
      render(<PanelFileList panelId="p1" tabId="tab1" />);
    });

    expect(screen.getByTestId("mock-panel-item-..")).toBeInTheDocument();
    expect(screen.getByTestId("mock-panel-item-file1.txt")).toBeInTheDocument();
    expect(screen.getByTestId("mock-panel-item-dir1")).toBeInTheDocument();
  });

  it("calls moveDirectory on mount if tab exists", async () => {
    await act(async () => {
      useTabStore.setState({
        tabs: {
          p1: [
            { id: "tab1", path: "/mock", title: "Mock Tab", isActive: true },
          ],
        },
      });
      useFileStore.getState().setFileState("p1", "tab1", {
        currentDir: "/mock",
        files: defaultFiles,
        selectedIndex: 1,
        sortKey: "name",
        sortOrder: "asc",
      });
      render(<PanelFileList panelId="p1" tabId="tab1" />);
    });

    expect(actions.moveDirectory).toHaveBeenCalledWith("tab1", "/mock");
  });

  it("sorts files by name asc by default", async () => {
    await act(async () => {
      useTabStore.setState({
        tabs: {
          p1: [
            { id: "tab1", path: "/mock", title: "Mock Tab", isActive: true },
          ],
        },
      });
      useFileStore.getState().setFileState("p1", "tab1", {
        currentDir: "/mock",
        files: defaultFiles,
        selectedIndex: 1,
        sortKey: "name",
        sortOrder: "asc",
      });
      render(<PanelFileList panelId="p1" tabId="tab1" />);
    });

    const items = screen.getAllByTestId(/mock-panel-item/);
    expect(items[0].textContent).toContain("..");
    expect(items[1].textContent).toContain("dir1");
    expect(items[2].textContent).toContain("file1.txt");
  });

  it("renders file list with correct items", async () => {
    await act(async () => {
      render(<PanelFileList panelId="p1" tabId="tab1" />);
    });

    expect(screen.getByTestId("mock-panel-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-panel-item-..")).toBeInTheDocument();
    expect(screen.getByTestId("mock-panel-item-dir1")).toBeInTheDocument();
    expect(screen.getByTestId("mock-panel-item-file1.txt")).toBeInTheDocument();
  });

  it("initializes with the tab path", async () => {
    await act(async () => {
      render(<PanelFileList panelId="p1" tabId="tab1" />);
    });
    expect(actions.moveDirectory).toHaveBeenCalledWith("tab1", "/path");
  });

  it("renders a fallback when tab is undefined", async () => {
    await act(async () => {
      useTabStore.setState({
        tabs: {
          p1: [
            { id: "tab1", path: "/path", title: "Mock Tab", isActive: true },
          ],
        },
      });
      useFileStore.setState({
        fileStates: {
          p1: {
            tab1: {
              currentDir: "/path",
              files: [],
              selectedIndex: 0,
              sortKey: "name",
              sortOrder: "asc",
            },
          },
        },
      });

      render(<PanelFileList panelId="p1" tabId="undefined-tab" />);
    });

    expect(screen.getByText("No directory selected")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-panel-header")).not.toBeInTheDocument();
  });

  it("navigates to directory on item click", async () => {
    await act(async () => {
      render(<PanelFileList panelId="p1" tabId="tab1" />);
    });

    // Click on a directory item
    await act(async () => {
      const dirItem = screen.getByTestId("mock-panel-item-dir1");
      dirItem.click();
    });

    expect(actions.moveDirectory).toHaveBeenCalledWith("tab1", "/dir1");
  });

  it("sorts files with directories first when sortKey is not file_type", async () => {
    await act(async () => {
      // Setup sort by name ascending
      useFileStore.getState().setFileState("p1", "tab1", {
        sortKey: "name",
        sortOrder: "asc",
      });

      render(<PanelFileList panelId="p1" tabId="tab1" />);
    });

    // Get all items
    const items = screen.getAllByTestId(/mock-panel-item/);

    // First should be parent dir
    expect(items[0]).toHaveAttribute("data-testid", "mock-panel-item-..");

    // Second should be other dir (directories first)
    expect(items[1]).toHaveAttribute("data-testid", "mock-panel-item-dir1");

    // Last should be the file
    expect(items[2]).toHaveAttribute(
      "data-testid",
      "mock-panel-item-file1.txt"
    );
  });

  it("sorts files by name descending", async () => {
    // Setup sort by name descending
    await act(async () => {
      (readDirectory as Mock).mockResolvedValueOnce([
        {
          name: "..",
          path: "/parent",
          is_dir: true,
          size: 0,
          modified: 0,
          file_type: "dir",
        },
        {
          name: "adir",
          path: "/adir",
          is_dir: true,
          size: 0,
          modified: 0,
          file_type: "dir",
        },
        {
          name: "bdir",
          path: "/bdir",
          is_dir: true,
          size: 0,
          modified: 0,
          file_type: "dir",
        },
      ]);

      useFileStore.getState().setFileState("p1", "tab1", {
        sortKey: "name",
        sortOrder: "desc",
      });

      render(<PanelFileList panelId="p1" tabId="tab1" />);
    });

    // Get all items
    const items = screen.getAllByTestId(/mock-panel-item/);

    // First should be parent dir (always)
    expect(items[0]).toHaveAttribute("data-testid", "mock-panel-item-..");

    // Second should be "bdir" (higher alphabetically when desc)
    expect(items[1]).toHaveAttribute("data-testid", "mock-panel-item-bdir");

    // Third should be "adir" (lower alphabetically when desc)
    expect(items[2]).toHaveAttribute("data-testid", "mock-panel-item-adir");
  });

  it("sorts files by size", async () => {
    // Setup sort by size ascending
    await act(async () => {
      (readDirectory as Mock).mockResolvedValueOnce([
        {
          name: "..",
          path: "/parent",
          is_dir: true,
          size: 0,
          modified: 0,
          file_type: "dir",
        },
        {
          name: "small.txt",
          path: "/small.txt",
          is_dir: false,
          size: 100,
          modified: 0,
          file_type: "txt",
        },
        {
          name: "large.txt",
          path: "/large.txt",
          is_dir: false,
          size: 500,
          modified: 0,
          file_type: "txt",
        },
      ]);

      useFileStore.getState().setFileState("p1", "tab1", {
        sortKey: "size",
        sortOrder: "asc",
      });

      render(<PanelFileList panelId="p1" tabId="tab1" />);
    });

    // Get all items
    const items = screen.getAllByTestId(/mock-panel-item/);

    // First should be parent dir (always)
    expect(items[0]).toHaveAttribute("data-testid", "mock-panel-item-..");

    // Second should be smaller file
    expect(items[1]).toHaveAttribute(
      "data-testid",
      "mock-panel-item-small.txt"
    );

    // Third should be larger file
    expect(items[2]).toHaveAttribute(
      "data-testid",
      "mock-panel-item-large.txt"
    );
  });

  it("sorts files by file_type without prioritizing directories", async () => {
    // Setup sort by file_type
    await act(async () => {
      (readDirectory as Mock).mockResolvedValueOnce([
        {
          name: "..",
          path: "/parent",
          is_dir: true,
          size: 0,
          modified: 0,
          file_type: "dir",
        },
        {
          name: "file.txt",
          path: "/file.txt",
          is_dir: false,
          size: 100,
          modified: 0,
          file_type: "txt",
        },
        {
          name: "dir",
          path: "/dir",
          is_dir: true,
          size: 0,
          modified: 0,
          file_type: "dir",
        },
      ]);

      useFileStore.getState().setFileState("p1", "tab1", {
        sortKey: "file_type",
        sortOrder: "asc",
      });

      render(<PanelFileList panelId="p1" tabId="tab1" />);
    });

    // Get all items
    const items = screen.getAllByTestId(/mock-panel-item/);

    // First should be parent dir (always)
    expect(items[0]).toHaveAttribute("data-testid", "mock-panel-item-..");

    // Second should be other dir (same type as parent, but parent is always first)
    expect(items[1]).toHaveAttribute("data-testid", "mock-panel-item-dir");

    // Third should be the text file
    expect(items[2]).toHaveAttribute("data-testid", "mock-panel-item-file.txt");
  });

  it("handles no parent directory entry correctly", async () => {
    // Setup without parent directory entry
    await act(async () => {
      (readDirectory as Mock).mockResolvedValueOnce([
        {
          name: "dir1",
          path: "C:\\dir1",
          is_dir: true,
          size: 0,
          modified: 0,
          file_type: "dir",
        },
        {
          name: "file1.txt",
          path: "C:\\file1.txt",
          is_dir: false,
          size: 100,
          modified: 0,
          file_type: "txt",
        },
      ]);

      useTabStore.setState({
        tabs: {
          p1: [{ id: "tab1", path: "C:\\", title: "Mock Tab", isActive: true }],
        },
      });

      render(<PanelFileList panelId="p1" tabId="tab1" />);
    });

    expect(screen.queryByTestId("mock-panel-item-..")).not.toBeInTheDocument();
    expect(screen.getByTestId("mock-panel-item-dir1")).toBeInTheDocument();
    expect(screen.getByTestId("mock-panel-item-file1.txt")).toBeInTheDocument();
  });

  it("displays the current directory path", async () => {
    await act(async () => {
      useFileStore.getState().setFileState("p1", "tab1", {
        currentDir: "/test/path",
        files: defaultFiles,
        selectedIndex: 0,
        sortKey: "name",
        sortOrder: "asc",
      });

      render(<PanelFileList panelId="p1" tabId="tab1" />);
    });

    expect(
      screen.getByTestId(`mock-panel-header-p1-tab1-name-asc`)
    ).toBeInTheDocument();
  });
});
