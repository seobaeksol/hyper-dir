import { describe, it, expect } from "vitest";
import * as formatters from "@/components/layout/panel/formatters";

describe("formatters", () => {
  it("should export formatter functions", () => {
    expect(formatters).toBeDefined();
    expect(typeof formatters.formatBytes).toBe("function");
    expect(typeof formatters.formatTimestamp).toBe("function");
  });

  describe("formatBytes", () => {
    it("formats bytes correctly", () => {
      expect(formatters.formatBytes(0)).toBe("0.0 B");
      expect(formatters.formatBytes(512)).toBe("512.0 B");
      expect(formatters.formatBytes(1024)).toBe("1.0 KB");
      expect(formatters.formatBytes(1048576)).toBe("1.0 MB");
      expect(formatters.formatBytes(1073741824)).toBe("1.0 GB");
      expect(formatters.formatBytes(1536)).toBe("1.5 KB");
    });
    it("returns '-' for null or undefined", () => {
      expect(formatters.formatBytes(undefined)).toBe("-");
      expect(formatters.formatBytes(null as any)).toBe("-");
    });
    it("handles negative and edge values", () => {
      expect(formatters.formatBytes(-1)).toBe("-1.0 B");
      expect(formatters.formatBytes(Number.MAX_SAFE_INTEGER)).toMatch(/\d+\.\d+ GB/);
    });
  });

  describe("formatTimestamp", () => {
    it("formats valid unix timestamp (seconds) as local string", () => {
      // Use a fixed timestamp for 2020-01-01T00:00:00Z
      const ts = 1577836800;
      const formatted = formatters.formatTimestamp(ts);
      expect(typeof formatted).toBe("string");
      // Should contain year 2020
      expect(formatted).toMatch(/2020/);
    });
    it("returns '-' for undefined, null, or 0", () => {
      expect(formatters.formatTimestamp(undefined)).toBe("-");
      expect(formatters.formatTimestamp(null as any)).toBe("-");
      expect(formatters.formatTimestamp(0)).toBe("-");
    });
    it("handles negative and far future timestamps", () => {
      expect(formatters.formatTimestamp(-1)).toBe(new Date(-1000).toLocaleString());
      expect(formatters.formatTimestamp(9999999999)).toBe(new Date(9999999999 * 1000).toLocaleString());
    });
  });
});
