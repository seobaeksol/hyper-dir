import { render } from "@testing-library/react";
import { FileSearchResultList } from "@/components/command-palette/FileSearchResultList";
import { describe, it } from "vitest";

describe("FileSearchResultList", () => {
  it("renders file results", () => {
    render(
      <FileSearchResultList
        results={[{ path: "/foo", name: "foo" }]}
        onSelect={() => {}}
      />
    );
  });
  // TODO: Add tests for selection, highlighting, and empty state
});
