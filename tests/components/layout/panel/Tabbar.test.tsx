import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Tabbar } from "@/components/layout/panel/Tabbar";

describe("Tabbar", () => {
  it("renders without crashing", () => {
    render(<Tabbar />);
  });
  // TODO: Add tests for tab switching, close, and overflow
});
