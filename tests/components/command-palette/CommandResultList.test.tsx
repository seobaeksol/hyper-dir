import { render } from "@testing-library/react";
import { CommandResultList } from "@/components/command-palette/CommandResultList";
import { describe, it } from "vitest";

describe("CommandResultList", () => {
  it("renders with results", () => {
    render(
      <CommandResultList
        results={[{ id: 1, name: "Test" }]}
        onSelect={() => {}}
      />
    );
  });
  // TODO: Add tests for selection, keyboard navigation, and empty state
});
