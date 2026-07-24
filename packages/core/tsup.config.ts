import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'umd'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  splitting: true,
  globalName: 'SmartMailto',
  outExtension({ format }) {
    return {
      js: format === 'umd' ? `.umd.js` : format === 'cjs' ? `.cjs` : `.js`,
    };
  },
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
