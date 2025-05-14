import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import { GitPanel } from "@/components/layout/sidebar/panels/GitPanel";

describe("GitPanel", () => {
  it("renders without crashing", () => {
    render(<GitPanel />);
  });
});
