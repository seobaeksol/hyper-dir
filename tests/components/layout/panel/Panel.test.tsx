import { describe, it, expect, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { Panel } from "@/components/layout/panel/Panel";
import { usePanelStore } from "@/state/panelStore";
import { useTabStore } from "@/state/tabStore";

describe("Panel", () => {
  afterEach(() => {
    usePanelStore.setState({ panels: [] });
    useTabStore.setState({ tabs: {} });
  });

  it("renders without crashing", () => {
    render(<Panel panelId="test-panel" />);
  });

  it("renders Tabbar always and PanelFileList when activeTab exists", () => {
    usePanelStore.setState({
      panels: [
        {
          id: "test-panel",
          activeTabId: "tab1",
          position: { row: 0, column: 0 },
        },
      ],
    });
    useTabStore.setState({
      tabs: {
        "test-panel": [
          {
            id: "tab1",
            path: "/test",
            title: "Test",
            isActive: true,
          },
        ],
      },
    });

    const { getByTestId } = render(<Panel panelId="test-panel" />);
    expect(getByTestId("tabbar")).toBeInTheDocument();
    expect(getByTestId("panelfilelist")).toBeInTheDocument();
  });

  it("renders Tabbar but not PanelFileList if no activeTab", () => {
    usePanelStore.setState({
      panels: [
        {
          id: "test-panel",
          activeTabId: "tab1",
          position: { row: 0, column: 0 },
        },
      ],
    });

    const { getByTestId, queryByTestId } = render(
      <Panel panelId="test-panel" />
    );

    expect(getByTestId("tabbar")).toBeInTheDocument();
    expect(queryByTestId("panelfilelist")).not.toBeInTheDocument();
  });
});
