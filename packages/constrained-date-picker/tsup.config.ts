import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/react/index.ts",
      "core/index": "src/core/index.ts",
      "presets/index": "src/react/presets/index.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom"],
    outDir: "dist",
  },
]);
