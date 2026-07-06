import { fileURLToPath } from 'node:url';

const srcRoot = fileURLToPath(new URL('./src', import.meta.url));

const config = {
  // Match Next.js's automatic JSX runtime so components rendered in tests do not
  // need an explicit `import React` (Next uses the automatic runtime; the esbuild
  // default would otherwise emit classic React.createElement and throw "React is
  // not defined" for files that only import named hooks).
  esbuild: {
    jsx: 'automatic',
  },
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
