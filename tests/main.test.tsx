import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";

// Mock dependencies
vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

vi.mock("@/App", () => ({
  default: vi.fn(() => <div>Mock App</div>),
}));

describe("main.tsx", () => {
  let mockRoot: HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRoot = document.createElement("div");
    mockRoot.id = "root";
    document.body.appendChild(mockRoot);
  });

  it("should render the app in React.StrictMode", async () => {
    // Import the main module which triggers the render
    await import("@/main");

    // Verify createRoot was called with the root element
    expect(ReactDOM.createRoot).toHaveBeenCalledWith(
      document.getElementById("root")
    );

    // Get the render function that was called
    const mockRender = (ReactDOM.createRoot as any).mock.results[0].value
      .render;

    // Verify the render function was called
    expect(mockRender).toHaveBeenCalledTimes(1);

    // Verify the component passed to render is React.StrictMode wrapping App
    const renderCall = mockRender.mock.calls[0][0];

    // Check that the component is a StrictMode wrapping App
    expect(renderCall.type).toBe(React.StrictMode);
    expect(renderCall.props.children.type).toBe(App);
  });
});
