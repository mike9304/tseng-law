import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

const buildDir = resolve(process.cwd(), '.next-build');

rmSync(buildDir, { recursive: true, force: true });
