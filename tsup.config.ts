import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  dts: {
    entry: "./index.ts",
  },
  clean: true,
  treeshake: true,
  splitting: false,
});
