import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('columns without an authored image', () => {
  it('supplies an existing image for cards, recommendations and article metadata', () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'column-no-image-'));
    temporaryDirectories.push(directory);
    fs.writeFileSync(path.join(directory, '001-no-image.md'), [
      '---',
      'title: "A criminal procedure article"',
      'published: "2026-10-08"',
      'categories: ["Taiwan Legal Information"]',
      '---',
      '',
      'This article has no authored illustration.',
    ].join('\n'));

    const post = getColumnPost('no-image', 'en', { columnsDir: directory });
    expect(post).toBeDefined();
    expect(post!.featuredImage).toMatch(/^\/images\//);
    const imagePath = path.join(process.cwd(), 'public', post!.featuredImage);
    expect(fs.existsSync(imagePath), `Missing public asset: ${post!.featuredImage}`).toBe(true);
    expect(fs.statSync(imagePath).size).toBeGreaterThan(0);
    expect(post!.featuredImageCaption).toBeUndefined();
  });
});
