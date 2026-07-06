import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

const distDirs = process.env.NEXT_DIST_DIR
  ? [process.env.NEXT_DIST_DIR]
  : [process.env.NEXT_DEV ? '.next-dev' : '.next-build'];

for (const distDir of distDirs) {
  rmSync(resolve(process.cwd(), distDir), { recursive: true, force: true });
}
