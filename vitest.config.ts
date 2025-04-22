import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/utils/setup.ts",
    coverage: {
      provider: "istanbul",
      exclude: [
        "node_modules",
        "build",
        "dist",
        "src-tauri",
        "tests",
        "*.config.ts",
      ],
      reporter: ["text", "lcov", "html"],
    },
  },
});
