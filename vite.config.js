// vite.config.js
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import path from 'path';

export default defineConfig({
  plugins: [],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        // autoprefixer,
      ],
    },
  },

  // vitest
  test: {
    globals: true,
    environment: 'happy-dom', // 或者 'jsdom', 根据需求选择
  }
});