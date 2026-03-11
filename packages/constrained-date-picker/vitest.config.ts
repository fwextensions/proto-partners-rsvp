import { defineConfig } from "vitest/config";

export default defineConfig({
  css: {
    // Disable PostCSS processing entirely for tests
    postcss: {},
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
    css: false,
  },
});
