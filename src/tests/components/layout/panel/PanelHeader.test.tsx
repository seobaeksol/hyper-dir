import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PanelHeader } from "@/components/layout/panel/PanelHeader";
import * as actions from "@/state/actions";
import { usePanelStore } from "@/state/panelStore";
import { useFileStore, useTabStore } from "@/state";

// Mock dependencies
vi.mock("@/state/actions", () => ({
  setSort: vi.fn(),
  setCurrentDir: vi.fn(),
  moveDirectory: vi.fn(),
}));

const panelId = "p1";
const tabId = "t1";
const sortKeys = ["name", "file_type", "size", "modified"] as const;
const sortOrders = ["asc", "desc"] as const;

describe("PanelHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePanelStore.setState({
      panels: [
        {
          id: panelId,
          activeTabId: tabId,
          position: { row: 0, column: 0 },
        },
      ],
    });
    useTabStore.setState({
      tabs: {
        [panelId]: [
          {
            id: tabId,
            path: "/test",
            title: "Test",
            isActive: true,
          },
        ],
      },
    });
    useFileStore.setState({
      fileStates: {
        [panelId]: {
          [tabId]: {
            sortKey: "name",
            sortOrder: "asc",
            files: [],
            selectedIndex: -1,
            currentDir: "/test",
          },
        },
      },
    });
  });

  it("renders all header columns", () => {
    render(
      <PanelHeader
        panelId={panelId}
        tabId={tabId}
        sortKey="name"
        sortOrder="asc"
        currentDir="/test"
      />
    );

    waitFor(() => {
      expect(screen.getByText("Name ▲")).toBeInTheDocument();
      expect(screen.getByText("Type")).toBeInTheDocument();
      expect(screen.getByText("Size")).toBeInTheDocument();
      expect(screen.getByText("Modified")).toBeInTheDocument();
    });
  });

  it("shows correct sort icon for active column and order", () => {
    for (const key of sortKeys) {
      for (const order of sortOrders) {
        const rendered = render(
          <PanelHeader
            panelId={panelId}
            tabId={tabId}
            sortKey={key}
            sortOrder={order}
            currentDir="/test"
          />
        );
        const label =
          key === "file_type"
            ? "Type"
            : key.charAt(0).toUpperCase() + key.slice(1);
        const icon = order === "asc" ? "▲" : "▼";
        waitFor(() => {
          expect(rendered.getByText(`${label} ${icon}`)).toBeInTheDocument();
        });
      }
    }
  });

  it("shows no sort icon for inactive columns", () => {
    render(
      <PanelHeader
        panelId={panelId}
        tabId={tabId}
        sortKey="name"
        sortOrder="asc"
        currentDir="/test"
      />
    );
    waitFor(() => {
      const typeHeader = screen.getByText("Type", { exact: false });
      expect(typeHeader).toBeInTheDocument();
      expect(typeHeader.textContent).toContain("Type");
      expect(typeHeader.textContent).not.toContain("▲");
      expect(typeHeader.textContent).not.toContain("▼");

      const sizeHeader = screen.getByText("Size", { exact: false });
      expect(sizeHeader).toBeInTheDocument();
      expect(sizeHeader.textContent).toContain("Size");
      expect(sizeHeader.textContent).not.toContain("▲");
      expect(sizeHeader.textContent).not.toContain("▼");

      const modifiedHeader = screen.getByText("Modified", { exact: false });
      expect(modifiedHeader).toBeInTheDocument();
      expect(modifiedHeader.textContent).toContain("Modified");
      expect(modifiedHeader.textContent).not.toContain("▲");
      expect(modifiedHeader.textContent).not.toContain("▼");
    });
  });

  it("calls setSort with toggled order when clicking active column", () => {
    render(
      <PanelHeader
        panelId={panelId}
        tabId={tabId}
        sortKey="name"
        sortOrder="asc"
        currentDir="/test"
      />
    );

    waitFor(() => {
      const nameHeader = screen.getByText("Name ▲");
      fireEvent.click(nameHeader);
      expect(actions.setSort).toHaveBeenCalledWith(
        panelId,
        tabId,
        "name",
        "desc"
      );

      // Now test with desc order
      vi.clearAllMocks();
      render(
        <PanelHeader
          panelId={panelId}
          tabId={tabId}
          sortKey="name"
          sortOrder="desc"
          currentDir="/test"
        />
      );
      fireEvent.click(screen.getByText("Name ▼"));
      expect(actions.setSort).toHaveBeenCalledWith(
        panelId,
        tabId,
        "name",
        "asc"
      );
    });
  });

  it("calls setSort with asc when clicking inactive column", () => {
    render(
      <PanelHeader
        panelId={panelId}
        tabId={tabId}
        sortKey="name"
        sortOrder="asc"
        currentDir="/test"
      />
    );

    waitFor(() => {
      const typeHeader = screen.getByText("Type");
      fireEvent.click(typeHeader);
      expect(actions.setSort).toHaveBeenCalledWith(
        panelId,
        tabId,
        "file_type",
        "asc"
      );
      const sizeHeader = screen.getByText("Size");
      fireEvent.click(sizeHeader);
      expect(actions.setSort).toHaveBeenCalledWith(
        panelId,
        tabId,
        "size",
        "asc"
      );
      const modifiedHeader = screen.getByText("Modified");
      fireEvent.click(modifiedHeader);
      expect(actions.setSort).toHaveBeenCalledWith(
        panelId,
        tabId,
        "modified",
        "asc"
      );
    });
  });

  describe("currentDir editing", () => {
    it("displays currentDir as plain text by default", () => {
      render(
        <PanelHeader
          panelId={panelId}
          tabId={tabId}
          sortKey="name"
          sortOrder="asc"
          currentDir="/test/path"
        />
      );

      waitFor(() => {
        expect(screen.getByText("/test/path")).toBeInTheDocument();
      });
    });

    it("transforms into input field when clicked", () => {
      render(
        <PanelHeader
          panelId={panelId}
          tabId={tabId}
          sortKey="name"
          sortOrder="asc"
          currentDir="/test/path"
        />
      );

      waitFor(() => {
        const dirElement = screen.getByText("/test/path");
        fireEvent.click(dirElement);

        const input = screen.getByDisplayValue("/test/path");
        expect(input).toBeInTheDocument();
        expect(input.tagName).toBe("INPUT");
      });
    });

    it("calls setCurrentDir when Enter is pressed", () => {
      render(
        <PanelHeader
          panelId={panelId}
          tabId={tabId}
          sortKey="name"
          sortOrder="asc"
          currentDir="/test/path"
        />
      );

      waitFor(() => {
        const dirElement = screen.getByText("/test/path");
        fireEvent.click(dirElement);

        const input = screen.getByDisplayValue("/test/path");
        fireEvent.change(input, { target: { value: "/new/path" } });
        fireEvent.keyDown(input, { key: "Enter" });

        expect(actions.setCurrentDir).toHaveBeenCalledWith(
          panelId,
          tabId,
          "/new/path"
        );
      });
    });

    it("reverts to plain text when Escape is pressed", () => {
      render(
        <PanelHeader
          panelId={panelId}
          tabId={tabId}
          sortKey="name"
          sortOrder="asc"
          currentDir="/test/path"
        />
      );

      waitFor(() => {
        const dirElement = screen.getByText("/test/path");
        fireEvent.click(dirElement);

        const input = screen.getByDisplayValue("/test/path");
        fireEvent.keyDown(input, { key: "Escape" });

        expect(screen.getByText("/test/path")).toBeInTheDocument();
        expect(
          screen.queryByDisplayValue("/test/path")
        ).not.toBeInTheDocument();
      });
    });
  });
});
