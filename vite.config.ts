// vite.config.ts

/// <reference types="vitest" />
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    // ...
  },
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
  },
  plugins: [
    reactRefresh(),
    svgrPlugin(),
  ],
});
