import { fileURLToPath } from 'node:url';

const srcRoot = fileURLToPath(new URL('./src', import.meta.url));

const defaultExcluded = ['node_modules', '.next', 'out', 'coverage'];
const cwdTests = [
  'src/lib/metrics/__tests__/visit-store.test.ts',
  'src/lib/builder/security/__tests__/qa-runtime-attestation.test.ts',
  'src/lib/builder/branches/__tests__/{approval-store,branch-store}.test.ts',
  'src/lib/builder/crm/__tests__/{automation-engine,campaign-queue,tracking-model,mailchimp-audience,segments-store,integrations-model,contact-store}.test.ts',
  'src/lib/builder/marketing/__tests__/{analytics-integrations,subscriber-crm-link}.test.ts',
];

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
    // Vitest 3's fork IPC can time out on onTaskUpdate after an otherwise
    // completed suite (upstream #8164). Threads avoid that fork transport;
    // two workers also bound the concurrent file-backend test workload.
    pool: 'threads',
    maxWorkers: 2,
    // These integration tests intentionally change cwd, which Node only
    // permits in processes. Keep their existing fork isolation and assertions.
    projects: [
      { extends: true, test: { name: 'unit', pool: 'threads', exclude: [...defaultExcluded, ...cwdTests] } },
      { esbuild: { jsx: 'automatic' }, resolve: { alias: { '@': srcRoot } }, test: { name: 'cwd-integration', pool: 'forks', include: cwdTests, exclude: defaultExcluded, environment: 'node', globals: true, setupFiles: ['./tests/setup.ts'] } },
    ],
    environment: 'node',
    exclude: defaultExcluded,
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
