import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Keep all six existing URLs and allow direct loads on any static host.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rolldownOptions: {
      input: Object.fromEntries(['index', 'cars', 'portraits', 'booking', 'impressum', 'privacy']
        .map(page => [page, resolve(import.meta.dirname, `${page}.html`)])),
    },
  },
});
