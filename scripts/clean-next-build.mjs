import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

const distDirs = process.env.NEXT_DIST_DIR
  ? [process.env.NEXT_DIST_DIR]
  : ['.next-build', '.next-dev'];

for (const distDir of distDirs) {
  rmSync(resolve(process.cwd(), distDir), { recursive: true, force: true });
}
