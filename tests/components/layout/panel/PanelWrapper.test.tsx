import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { PanelWrapper } from "@/components/layout/panel/PanelWrapper";

describe("PanelWrapper", () => {
  it("renders without crashing", () => {
    render(<PanelWrapper />);
  });
});
