import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import { Statusbar } from "@/components/layout/Statusbar";

describe("Statusbar", () => {
  it("renders without crashing", () => {
    render(<Statusbar />);
  });
});
