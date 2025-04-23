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
  beforeEach(() => {
    vi.clearAllMocks();
    act(() => {
      useFileStore.getState().setFileState("p1", "tab1", {
        currentDir: "/mock",
        files: [],
        selectedIndex: 0,
        sortKey: "name",
        sortOrder: "asc",
      });
      useTabStore.setState({
        tabs: {},
      });
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
});
