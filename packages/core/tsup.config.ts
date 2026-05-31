import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  splitting: true,
  // Ensure zero external dependencies
  noExternal: [],
  external: [],
  // Target modern browsers
  target: 'es2020',
  outDir: 'dist',
  esbuildOptions(options) {
    options.define = {
      __SMART_MAILTO_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.0.0'),
    };
  },
});
