#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const entry = path.join(root, 'tests', 'qa-agent', 'sweep-runner.ts');

const child = spawn(
  path.join(root, 'node_modules', '.bin', 'vite-node'),
  ['--root', root, '--config', path.join(root, 'vitest.config.ts'), entry],
  { stdio: 'inherit', env: process.env, cwd: root },
);

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
