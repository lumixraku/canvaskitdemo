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
  // 其他Vite配置...
});