import { vi } from "vitest";

export const nanoidMock = vi.fn();

export const mockNanoid = (prefix: string) => {
  vi.mock("nanoid", () => ({
    nanoid: () => {
      nanoidMock();
      return `${prefix}-${nanoidMock.mock.calls.length}`;
    },
  }));
};
