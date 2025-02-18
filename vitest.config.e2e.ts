import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['**/*.e2e-spec.ts'],
    alias: {
      '@src': './src',
    },
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
  },
  resolve: {
    alias: {
      '@src': './src',
    },
  },
  plugins: [swc.vite()],
});
