import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ExplorerPanel } from "@/components/layout/sidebar/panels/ExplorerPanel";

describe("ExplorerPanel", () => {
  it("renders without crashing", () => {
    render(<ExplorerPanel />);
  });
});
