import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  dts: {
    entry: "./index.ts",
  },
  clean: true,
  treeshake: true,
  minify: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  splitting: false,
  sourcemap: false,
  target: 'es2018',
  esbuildOptions(options) {
    options.pure = ['console.log', 'console.debug', 'console.info', 'console.warn'];
    options.legalComments = 'none';
    options.mangleProps = /^_/;
  }
});
