import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import { SearchPanel } from "@/components/layout/sidebar/panels/SearchPanel";

describe("SearchPanel", () => {
  it("renders without crashing", () => {
    render(<SearchPanel />);
  });
});
