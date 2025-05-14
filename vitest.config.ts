import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    root: "./src",
    environment: "jsdom",
    globals: true,
    setupFiles: "./setup.vitest.ts",
    coverage: {
      provider: "istanbul",
      exclude: [
        "node_modules",
        "build",
        "dist",
        "src-tauri",
        "tests",
        "*.config.ts",
        "__mocks__",
      ],
      reporter: ["text", "lcov", "html"],
      reportsDirectory: "../coverage",
    },
  },
});
