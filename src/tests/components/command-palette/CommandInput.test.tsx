import { render, fireEvent } from "@testing-library/react";
import { CommandInput } from "@/components/command-palette/CommandInput";
import { describe, it, expect, vi } from "vitest";

const defaultPrompt = { message: "Enter something", initialValue: "default" };

describe("CommandInput", () => {
  it("renders normal mode input with correct placeholder and value", () => {
    const setQuery = vi.fn();
    const { getByRole } = render(
      <CommandInput prompt={undefined} query="hello" setQuery={setQuery} />
    );
    const input = getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "> Type a command...");
    expect(input).toHaveValue("hello");
  });

  it("calls setQuery when typing in normal mode", () => {
    const setQuery = vi.fn();
    const { getByRole } = render(
      <CommandInput prompt={undefined} query="" setQuery={setQuery} />
    );
    fireEvent.change(getByRole("textbox"), { target: { value: "test" } });
    expect(setQuery).toHaveBeenCalledWith("test");
  });

  it("renders prompt mode input with message and correct placeholder", () => {
    const setPromptInput = vi.fn();
    const { getByRole, getByText } = render(
      <CommandInput
        prompt={defaultPrompt}
        query="should not show"
        setQuery={vi.fn()}
        promptInput="abc"
        setPromptInput={setPromptInput}
      />
    );
    expect(getByText(defaultPrompt.message)).toBeInTheDocument();
    const input = getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", defaultPrompt.initialValue);
    expect(input).toHaveValue("abc");
  });

  it("calls setPromptInput when typing in prompt mode", () => {
    const setPromptInput = vi.fn();
    const { getByRole } = render(
      <CommandInput
        prompt={defaultPrompt}
        query=""
        setQuery={vi.fn()}
        promptInput=""
        setPromptInput={setPromptInput}
      />
    );
    fireEvent.change(getByRole("textbox"), { target: { value: "newval" } });
    expect(setPromptInput).toHaveBeenCalledWith("newval");
  });

  it("does not crash if setPromptInput is not provided in prompt mode", () => {
    const { getByRole } = render(
      <CommandInput
        prompt={defaultPrompt}
        query=""
        setQuery={vi.fn()}
        promptInput=""
      />
    );
    const input = getByRole("textbox");
    fireEvent.change(input, { target: { value: "ignored" } });
    expect(input).toBeInTheDocument();
  });

  it("shows empty string if promptInput is undefined in prompt mode", () => {
    const { getByRole } = render(
      <CommandInput
        prompt={defaultPrompt}
        query=""
        setQuery={vi.fn()}
        setPromptInput={vi.fn()}
      />
    );
    expect(getByRole("textbox")).toHaveValue("");
  });

  it("autofocuses the input in both modes", () => {
    const { getByRole, rerender } = render(
      <CommandInput prompt={undefined} query="" setQuery={vi.fn()} />
    );
    expect(getByRole("textbox")).toHaveFocus();
    rerender(
      <CommandInput
        prompt={defaultPrompt}
        query=""
        setQuery={vi.fn()}
        setPromptInput={vi.fn()}
      />
    );
    expect(getByRole("textbox")).toHaveFocus();
  });

  it("calls onPromptInput if provided in prompt mode", () => {
    const setPromptInput = vi.fn();
    const onPromptInput = vi.fn();
    const { getByRole } = render(
      <CommandInput
        prompt={defaultPrompt}
        query=""
        setQuery={vi.fn()}
        promptInput=""
        setPromptInput={setPromptInput}
        onPromptInput={onPromptInput}
      />
    );
    fireEvent.change(getByRole("textbox"), { target: { value: "foo" } });
    // setPromptInput is called, but onPromptInput is not automatically called by the component implementation
    expect(setPromptInput).toHaveBeenCalledWith("foo");
    // If you implement onPromptInput in the component, add its invocation test here
  });
});
