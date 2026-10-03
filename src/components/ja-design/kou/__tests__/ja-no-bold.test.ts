import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return name === '__tests__' ? [] : walk(full);
    return /\.tsx?$/.test(name) ? [full] : [];
  });
}

describe('no bold markup in the ja design (operator rule 2026-10-01)', () => {
  it('has no <b> or <strong> under ja-design/', () => {
    for (const file of walk(path.join(process.cwd(), 'src/components/ja-design'))) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/<(b|strong)[\s>]/);
    }
  });
});
