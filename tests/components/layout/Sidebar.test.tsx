import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Sidebar } from "@/components/layout/Sidebar";

describe("Sidebar", () => {
  it("renders without crashing", () => {
    render(<Sidebar />);
  });
  // TODO: Add tests for tab switching, open/close, and state logic
});
