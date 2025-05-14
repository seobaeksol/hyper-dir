import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import { ConfigPanel } from "@/components/layout/sidebar/panels/ConfigPanel";

describe("ConfigPanel", () => {
  it("renders without crashing", () => {
    render(<ConfigPanel />);
  });
});
