import { render, fireEvent } from "@testing-library/react";
import { CommandInput } from "@/components/command-palette/CommandInput";
import { describe, it, expect, vi } from "vitest";

describe("CommandInput", () => {
  it("renders input", () => {
    const { getByRole } = render(
      <CommandInput value="" onChange={() => {}} onKeyDown={() => {}} />
    );
    expect(getByRole("textbox")).toBeInTheDocument();
  });
  it("calls onChange", () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <CommandInput value="" onChange={onChange} onKeyDown={() => {}} />
    );
    fireEvent.change(getByRole("textbox"), { target: { value: "test" } });
    expect(onChange).toHaveBeenCalled();
  });
  it("calls onKeyDown", () => {
    const onKeyDown = vi.fn();
    const { getByRole } = render(
      <CommandInput value="" onChange={() => {}} onKeyDown={onKeyDown} />
    );
    fireEvent.keyDown(getByRole("textbox"), { key: "Enter" });
    expect(onKeyDown).toHaveBeenCalled();
  });
});
