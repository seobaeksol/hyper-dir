import { render, screen, fireEvent, act } from "@testing-library/react";
import { ToastContainer } from "@/components/common/ToastContainer";
import { useToastStore } from "@/state/toastStore";
import { vi, describe, it, beforeEach, afterEach, expect } from "vitest";

describe("ToastContainer", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [], toastId: 0 });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders a toast message", () => {
    useToastStore.getState().showToast("Test Toast");
    render(<ToastContainer />);
    expect(screen.getByText("Test Toast")).toBeInTheDocument();
  });

  it("removes toast on click", () => {
    useToastStore.getState().showToast("Dismiss me");
    render(<ToastContainer />);
    const toast = screen.getByTestId("toast-1");
    fireEvent.click(toast);
    expect(toast).not.toBeInTheDocument();
  });

  it("shows multiple toasts", () => {
    useToastStore.getState().showToast("Toast 1");
    useToastStore.getState().showToast("Toast 2");
    render(<ToastContainer />);
    expect(screen.getByText("Toast 1")).toBeInTheDocument();
    expect(screen.getByText("Toast 2")).toBeInTheDocument();
  });

  it("applies correct style for error type", () => {
    useToastStore.getState().showToast("Error!", { type: "error" });
    render(<ToastContainer />);
    const toast = screen.getByTestId("toast-1");
    expect(toast.className).toMatch(/bg-red-600/);
  });

  it("applies correct style for info type (default)", () => {
    useToastStore.getState().showToast("Info!");
    render(<ToastContainer />);
    const toast = screen.getByTestId("toast-1");
    expect(toast.className).toMatch(/bg-blue-600/);
  });

  it("removes toast after duration", () => {
    useToastStore.getState().showToast("Auto remove", { duration: 1000 });
    render(<ToastContainer />);
    expect(screen.getByText("Auto remove")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText("Auto remove")).not.toBeInTheDocument();
  });

  it("shows progress bar and it decreases over time", () => {
    useToastStore.getState().showToast("Progress", { duration: 1000 });
    render(<ToastContainer />);
    const bar = screen.getByTestId("progress-bar-1");
    expect(bar).toBeTruthy();
    const initialWidth = bar?.getAttribute("style");
    act(() => {
      vi.advanceTimersByTime(500);
    });
    // width should decrease
    const midWidth = bar?.getAttribute("style");
    expect(midWidth).not.toBe(initialWidth);
  });

  it("shows the correct progress bar color for error/info", () => {
    useToastStore.getState().showToast("Error!", { type: "error" });
    useToastStore.getState().showToast("Info!");
    render(<ToastContainer />);
    const firstToast = screen.getByTestId("toast-1");
    const secondToast = screen.getByTestId("toast-2");

    const firstToastMessage = screen.getByTestId("toast-message-1");
    const secondToastMessage = screen.getByTestId("toast-message-2");

    const firstToastBar = screen.getByTestId("progress-bar-1");
    const secondToastBar = screen.getByTestId("progress-bar-2");

    expect(firstToast).toBeInTheDocument();
    expect(secondToast).toBeInTheDocument();

    expect(firstToast).toHaveClass("bg-red-600");
    expect(secondToast).toHaveClass("bg-blue-600");

    expect(firstToastMessage).toHaveTextContent("Error!");
    expect(secondToastMessage).toHaveTextContent("Info!");

    expect(firstToastBar).toBeInTheDocument();
    expect(secondToastBar).toBeInTheDocument();

    expect(firstToastBar).toHaveClass("bg-red-100");
    expect(secondToastBar).toHaveClass("bg-blue-100");
  });
});
