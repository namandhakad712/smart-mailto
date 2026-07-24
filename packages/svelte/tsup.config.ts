import { readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { compile } from 'svelte/compiler';
import { defineConfig, type Options } from 'tsup';

const config: Options = {
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2020',
  external: ['svelte', '@smart-mailto/core'],
  esbuildPlugins: [
    {
      name: 'svelte',
      setup(build) {
        build.onLoad({ filter: /\.svelte$/ }, async ({ path }) => {
          const source = await readFile(path, 'utf8');
          const compiled = compile(source, {
            filename: path,
            generate: 'dom',
            css: 'external',
          });

          return {
            contents: compiled.js.code,
            loader: 'js',
            resolveDir: dirname(path),
          };
        });
      },
    },
  ],
};

export default defineConfig(config);
