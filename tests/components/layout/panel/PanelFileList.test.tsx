import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PanelFileList } from "@/components/layout/panel/PanelFileList";
import * as fileStore from "@/state/fileStore";
import * as tabStore from "@/state/tabStore";
import * as actions from "@/state/actions";

vi.mock("@/state/fileStore");
vi.mock("@/state/tabStore");
vi.mock("@/state/actions");

const mockTab = { id: "tab1", path: "/mock" };
const mockFiles = [
  {
    name: "..",
    is_dir: true,
    file_type: "dir",
    size: 0,
    modified: 0,
    path: "/",
  },
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
const mockFileState = {
  currentDir: "/mock",
  files: mockFiles,
  selectedIndex: 1,
  sortKey: "name",
  sortOrder: "asc",
};

describe("PanelFileList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (tabStore.useTabStore as any).mockReturnValue({ getTabById: vi.fn() });
    (fileStore.useFileStore as any).mockReturnValue({
      getCurrentFileState: vi.fn(),
    });
    (actions.moveDirectory as any).mockReset();
  });

  it("renders nothing if tab is not found", () => {
    (tabStore.useTabStore as any).mockReturnValue({
      getTabById: vi.fn(() => undefined),
    });
    render(<PanelFileList panelId="p1" tabId="t1" />);
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("renders files and parent entry", () => {
    (tabStore.useTabStore as any).mockReturnValue({
      getTabById: vi.fn(() => mockTab),
    });
    (fileStore.useFileStore as any).mockReturnValue({
      getCurrentFileState: vi.fn(() => mockFileState),
    });
    render(<PanelFileList panelId="p1" tabId="tab1" />);
    expect(screen.getByText("↩️ ..")).toBeInTheDocument();
    expect(
      screen.getByText((_, node) => node?.textContent === "📄 fileA.txt")
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, node) => node?.textContent === "📁 folderB")
    ).toBeInTheDocument();
  });

  it("calls moveDirectory on mount if tab exists", () => {
    (tabStore.useTabStore as any).mockReturnValue({
      getTabById: vi.fn(() => mockTab),
    });
    (fileStore.useFileStore as any).mockReturnValue({
      getCurrentFileState: vi.fn(() => mockFileState),
    });
    render(<PanelFileList panelId="p1" tabId="tab1" />);
    expect(actions.moveDirectory).toHaveBeenCalledWith("tab1", "/mock");
  });

  it("sorts files by name asc by default", () => {
    (tabStore.useTabStore as any).mockReturnValue({
      getTabById: vi.fn(() => mockTab),
    });
    (fileStore.useFileStore as any).mockReturnValue({
      getCurrentFileState: vi.fn(() => ({
        ...mockFileState,
        sortKey: "name",
        sortOrder: "asc",
      })),
    });
    render(<PanelFileList panelId="p1" tabId="tab1" />);
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
