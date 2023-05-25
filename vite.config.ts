/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.{spec,test}.{jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/*.{spec,test}.{js,ts}',
    ],
    globals: true,
    environment: 'jsdom',
    setupFiles: 'test/test_util.js',
  },
});
