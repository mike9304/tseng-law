import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const COLUMN_DIRS = [
  'src/content/columns',
  'src/content/columns-en',
  'src/content/columns-zh',
  'src/content/columns-ja',
] as const;

const DETAIL_SLUGS = [
  'investment',
  'civil',
  'family',
  'labor',
  'criminal',
  'ip',
] as const;

const HASH_FOR_DETAIL = new RegExp(
  `/(ko|zh-hant|en|ja)/services#(?:${DETAIL_SLUGS.join('|')})\\b`,
  'g',
);

function listMarkdownFiles(dir: string): string[] {
  const abs = path.join(process.cwd(), dir);
  return fs
    .readdirSync(abs)
    .filter((name) => name.endsWith('.md'))
    .map((name) => path.join(abs, name));
}

describe('column markdown service links', () => {
  it('points hashes at existing service-detail routes instead of listing-page anchors', () => {
    const leftovers: string[] = [];

    for (const dir of COLUMN_DIRS) {
      for (const file of listMarkdownFiles(dir)) {
        const text = fs.readFileSync(file, 'utf8');
        const matches = text.match(HASH_FOR_DETAIL) ?? [];
        for (const match of matches) {
          leftovers.push(`${path.relative(process.cwd(), file)}: ${match}`);
        }
      }
    }

    expect(leftovers).toEqual([]);
  });
});
