import { fileURLToPath } from 'node:url';

const srcRoot = fileURLToPath(new URL('./src', import.meta.url));

const config = {
  resolve: {
    alias: {
      '@': srcRoot,
    },
  },
  test: {
    environment: 'node',
    exclude: ['node_modules', '.next', 'out', 'coverage'],
    globals: true,
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'tests/**/*.{test,spec}.{ts,tsx}',
    ],
    passWithNoTests: true,
    setupFiles: ['./tests/setup.ts'],
  },
};

export default config;
