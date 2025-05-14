import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useToastStore } from "@/state/toastStore";

// Helper to advance timers and flush setTimeout
function flushTimers(ms: number) {
  vi.advanceTimersByTime(ms);
}

describe("state/toastStore", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should add a toast and auto-remove after default duration", () => {
    useToastStore.getState().showToast("Hello");
    expect(useToastStore.getState().toasts.length).toBe(1);
    flushTimers(1000);
    expect(useToastStore.getState().toasts.length).toBe(0);
  });

  it("should remove toast on click (removeToast)", () => {
    useToastStore.getState().showToast("Click me");
    const toast = useToastStore.getState().toasts[0];
    useToastStore.getState().removeToast(toast.id);
    expect(useToastStore.getState().toasts.length).toBe(0);
  });

  it("should support custom duration", () => {
    useToastStore.getState().showToast("Long toast", { duration: 2000 });
    expect(useToastStore.getState().toasts.length).toBe(1);
    flushTimers(1000);
    expect(useToastStore.getState().toasts.length).toBe(1);
    flushTimers(1000);
    expect(useToastStore.getState().toasts.length).toBe(0);
  });

  it("should support multiple toasts", () => {
    useToastStore.getState().showToast("Toast 1");
    useToastStore.getState().showToast("Toast 2");
    expect(useToastStore.getState().toasts.length).toBe(2);
  });

  it("should store type and createdAt", () => {
    useToastStore.getState().showToast("Error!", { type: "error" });
    const toast = useToastStore.getState().toasts[0];
    expect(toast.type).toBe("error");
    expect(typeof toast.createdAt).toBe("number");
  });

  it("should assign unique ids to each toast", () => {
    useToastStore.getState().showToast("Toast 1");
    useToastStore.getState().showToast("Toast 2");
    const [t1, t2] = useToastStore.getState().toasts;
    expect(t1.id).not.toBe(t2.id);
  });
});
