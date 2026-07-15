#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const viteNode = path.resolve(scriptDir, '../node_modules/vite-node/vite-node.mjs');
const script = path.join(scriptDir, 'run-production-stub-registry.ts');
const result = spawnSync(process.execPath, [viteNode, script, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, PRODUCTION_STUB_REGISTRY_CLI: '1' },
});

if (result.error) {
  console.error(result.error instanceof Error ? result.error.message : result.error);
  process.exitCode = 1;
} else {
  process.exitCode = typeof result.status === 'number' ? result.status : 1;
}
