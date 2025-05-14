import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import { StarredPanel } from "@/components/layout/sidebar/panels/StarredPanel";

describe("StarredPanel", () => {
  it("renders without crashing", () => {
    render(<StarredPanel />);
  });
});
