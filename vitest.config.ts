import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    alias: {
      '@src': './src',
    },
    root: './',
  },
  resolve: {
    alias: {
      '@src': './src',
    },
  },
  plugins: [swc.vite()],
});
