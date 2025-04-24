import { act, render, screen } from "@testing-library/react";

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PanelFileList } from "@/components/layout/panel/PanelFileList";
import { useFileStore } from "@/state/fileStore";
import { useTabStore } from "@/state/tabStore";
import * as actions from "@/state/actions";
import { usePanelStore } from "@/state/panelStore";

vi.mock("@tauri-apps/api/path", () => ({
  dirname: vi.fn(async () => "/mock/path"),
}));
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

const mockFiles = [
  {
    name: "fileA.txt",
    is_dir: false,
    file_type: "txt",
    size: 100,
    modified: 1,
    path: "/fileA.txt",
  },
  {
    name: "folderB",
    is_dir: true,
    file_type: "dir",
    size: 0,
    modified: 2,
    path: "/folderB",
  },
];

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
vi.spyOn(actions, "moveDirectory");

describe("PanelFileList", () => {
  const defaultFiles = [
    { name: "..", path: "/parent", is_dir: true, size: 0, mtime: 0 },
    { name: "dir1", path: "/dir1", is_dir: true, size: 0, mtime: 0 },
    {
      name: "file1.txt",
      path: "/file1.txt",
      is_dir: false,
      size: 100,
      mtime: 0,
    },
  ];

  const getTabByIdMock = vi.fn();
  const getCurrentFileStateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    getTabByIdMock.mockReturnValue({
      id: "tab1",
      path: "/path",
    });

    getCurrentFileStateMock.mockReturnValue({
      currentDir: "/path",
      files: defaultFiles,
      selectedIndex: 0,
      sortKey: "name",
      sortOrder: "asc",
    });

    (useTabStore as any).mockReturnValue({
      getTabById: getTabByIdMock,
    });

    (useFileStore as any).mockReturnValue({
      getCurrentFileState: getCurrentFileStateMock,
    });
  });

  afterEach(() => {
    act(() => {
      useFileStore.setState({
        fileStates: {},
      });
      useTabStore.setState({
        tabs: {},
      });
    });
  });

  it("renders nothing if tab is not found", async () => {
    // No tab set for this panel/tab id
    await act(async () => {
      render(<PanelFileList panelId="p1" tabId="t1" />);
    });
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("renders files and parent entry", async () => {
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
              files: mockFiles,
              selectedIndex: 1,
              sortKey: "name",
              sortOrder: "asc",
            },
          },
        },
      });
      render(<PanelFileList panelId="p1" tabId="tab1" />);
    });
    expect(screen.getByText("↩️ ..")).toBeInTheDocument();
    expect(
      screen.getByText((_, node) => node?.textContent === "📄 fileA.txt")
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, node) => node?.textContent === "📁 folderB")
    ).toBeInTheDocument();
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
        files: mockFiles,
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
        files: mockFiles,
        selectedIndex: 1,
        sortKey: "name",
        sortOrder: "asc",
      });
      render(<PanelFileList panelId="p1" tabId="tab1" />);
    });
    // There are two lists: header and files. The second <ul> contains file entries.
    const allUls = document.querySelectorAll("ul");
    const fileListUl = allUls[1];
    const items = fileListUl
      ? Array.from(fileListUl.querySelectorAll("li"))
      : [];
    expect(items[0].textContent).toContain("↩️ ..");
    expect(items[1].textContent).toContain("folderB");
    expect(items[2].textContent).toContain("fileA.txt");
  });

  it("renders file list with correct items", () => {
    render(<PanelFileList panelId="panel1" tabId="tab1" />);

    expect(screen.getByTestId("mock-panel-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-panel-item-..")).toBeInTheDocument();
    expect(screen.getByTestId("mock-panel-item-dir1")).toBeInTheDocument();
    expect(screen.getByTestId("mock-panel-item-file1.txt")).toBeInTheDocument();
  });

  it("initializes with the tab path", () => {
    render(<PanelFileList panelId="panel1" tabId="tab1" />);
    expect(actions.moveDirectory).toHaveBeenCalledWith("tab1", "/path");
  });

  it("renders a fallback when tab is undefined", () => {
    getTabByIdMock.mockReturnValue(undefined);

    render(<PanelFileList panelId="panel1" tabId="tab1" />);

    expect(screen.getByText("No directory selected")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-panel-header")).not.toBeInTheDocument();
  });

  it("navigates to directory on item click", () => {
    render(<PanelFileList panelId="panel1" tabId="tab1" />);

    // Click on a directory item
    const dirItem = screen.getByTestId("mock-panel-item-dir1");
    dirItem.click();

    expect(actions.moveDirectory).toHaveBeenCalledWith("tab1", "/dir1");
  });

  it("sorts files with directories first when sortKey is not file_type", () => {
    // Setup sort by name ascending
    getCurrentFileStateMock.mockReturnValue({
      currentDir: "/path",
      files: [
        { name: "..", path: "/parent", is_dir: true, size: 0, mtime: 0 },
        {
          name: "file1.txt",
          path: "/file1.txt",
          is_dir: false,
          size: 100,
          mtime: 0,
        },
        { name: "dir1", path: "/dir1", is_dir: true, size: 0, mtime: 0 },
      ],
      selectedIndex: 0,
      sortKey: "name",
      sortOrder: "asc",
    });

    render(<PanelFileList panelId="panel1" tabId="tab1" />);

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

  it("sorts files by name descending", () => {
    // Setup sort by name descending
    getCurrentFileStateMock.mockReturnValue({
      currentDir: "/path",
      files: [
        { name: "..", path: "/parent", is_dir: true, size: 0, mtime: 0 },
        { name: "adir", path: "/adir", is_dir: true, size: 0, mtime: 0 },
        { name: "bdir", path: "/bdir", is_dir: true, size: 0, mtime: 0 },
      ],
      selectedIndex: 0,
      sortKey: "name",
      sortOrder: "desc",
    });

    render(<PanelFileList panelId="panel1" tabId="tab1" />);

    // Get all items
    const items = screen.getAllByTestId(/mock-panel-item/);

    // First should be parent dir (always)
    expect(items[0]).toHaveAttribute("data-testid", "mock-panel-item-..");

    // Second should be "bdir" (higher alphabetically when desc)
    expect(items[1]).toHaveAttribute("data-testid", "mock-panel-item-bdir");

    // Third should be "adir" (lower alphabetically when desc)
    expect(items[2]).toHaveAttribute("data-testid", "mock-panel-item-adir");
  });

  it("sorts files by size", () => {
    // Setup sort by size ascending
    getCurrentFileStateMock.mockReturnValue({
      currentDir: "/path",
      files: [
        { name: "..", path: "/parent", is_dir: true, size: 0, mtime: 0 },
        {
          name: "small.txt",
          path: "/small.txt",
          is_dir: false,
          size: 100,
          mtime: 0,
        },
        {
          name: "large.txt",
          path: "/large.txt",
          is_dir: false,
          size: 500,
          mtime: 0,
        },
      ],
      selectedIndex: 0,
      sortKey: "size",
      sortOrder: "asc",
    });

    render(<PanelFileList panelId="panel1" tabId="tab1" />);

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

  it("sorts files by file_type without prioritizing directories", () => {
    // Setup sort by file_type
    getCurrentFileStateMock.mockReturnValue({
      currentDir: "/path",
      files: [
        {
          name: "..",
          path: "/parent",
          is_dir: true,
          size: 0,
          mtime: 0,
          file_type: "directory",
        },
        {
          name: "file.txt",
          path: "/file.txt",
          is_dir: false,
          size: 100,
          mtime: 0,
          file_type: "text",
        },
        {
          name: "dir",
          path: "/dir",
          is_dir: true,
          size: 0,
          mtime: 0,
          file_type: "directory",
        },
      ],
      selectedIndex: 0,
      sortKey: "file_type",
      sortOrder: "asc",
    });

    render(<PanelFileList panelId="panel1" tabId="tab1" />);

    // Get all items
    const items = screen.getAllByTestId(/mock-panel-item/);

    // First should be parent dir (always)
    expect(items[0]).toHaveAttribute("data-testid", "mock-panel-item-..");

    // Second should be other dir (same type as parent, but parent is always first)
    expect(items[1]).toHaveAttribute("data-testid", "mock-panel-item-dir");

    // Third should be the text file
    expect(items[2]).toHaveAttribute("data-testid", "mock-panel-item-file.txt");
  });

  it("handles no parent directory entry correctly", () => {
    // Setup without parent directory entry
    getCurrentFileStateMock.mockReturnValue({
      currentDir: "/path",
      files: [
        { name: "dir1", path: "/dir1", is_dir: true, size: 0, mtime: 0 },
        {
          name: "file1.txt",
          path: "/file1.txt",
          is_dir: false,
          size: 100,
          mtime: 0,
        },
      ],
      selectedIndex: 0,
      sortKey: "name",
      sortOrder: "asc",
    });

    render(<PanelFileList panelId="panel1" tabId="tab1" />);

    expect(screen.queryByTestId("mock-panel-item-..")).not.toBeInTheDocument();
    expect(screen.getByTestId("mock-panel-item-dir1")).toBeInTheDocument();
    expect(screen.getByTestId("mock-panel-item-file1.txt")).toBeInTheDocument();
  });

  it("displays the current directory path", () => {
    getCurrentFileStateMock.mockReturnValue({
      currentDir: "/test/path",
      files: defaultFiles,
      selectedIndex: 0,
      sortKey: "name",
      sortOrder: "asc",
    });

    render(<PanelFileList panelId="panel1" tabId="tab1" />);

    expect(screen.getByText("/test/path")).toBeInTheDocument();
  });
});
