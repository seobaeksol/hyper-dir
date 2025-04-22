import { render } from "@testing-library/react";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { describe, it } from "vitest";

describe("CommandPalette", () => {
  it("renders without crashing", () => {
    render(<CommandPalette open={true} onClose={() => {}} />);
  });
  // TODO: Expand with tests for open/close, search, and selection logic
});
