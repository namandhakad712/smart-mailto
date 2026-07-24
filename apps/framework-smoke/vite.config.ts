import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      input: {
        react: resolve(__dirname, 'react.html'),
        vue: resolve(__dirname, 'vue.html'),
        svelte: resolve(__dirname, 'svelte.html'),
      },
    },
  },
});
