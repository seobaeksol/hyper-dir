import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import { Titlebar } from "@/components/layout/Titlebar";

describe("Titlebar", () => {
  it("renders without crashing", () => {
    render(<Titlebar />);
  });
});
