import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        // Ensure service worker is not hashed
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.[0] === 'sw.js') {
            return 'sw.js';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    svgr(),
  ],
});
