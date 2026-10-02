import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';
import { toColumnListItems } from '@/lib/column-list-items';
import { buildSeoMetadata } from '@/lib/seo';

const temporaryDirectories: string[] = [];
afterEach(() => {
  for (const dir of temporaryDirectories.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function loadImageFixture(fields: string) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'column-image-'));
  temporaryDirectories.push(dir);
  fs.writeFileSync(path.join(dir, '001-image-fixture.md'), `---
title: "Image fixture"
featured_image: "../images/fixture.webp"
${fields}
---

The article body stays separate from image descriptions.
`);
  return getColumnPost('image-fixture', 'en', { columnsDir: dir })!;
}

describe('optional representative image descriptions', () => {
  it('passes localized alt to cards and both social metadata formats', () => {
    const post = loadImageFixture(`featured_image_alt: "  Road illustration  "
featured_image_caption: "  AI illustration, not evidence.  "
social_image: "../images/fixture.jpg"`);
    expect(post.featuredImage).toBe('/images/blog/fixture.webp');
    expect(post.featuredImageAlt).toBe('Road illustration');
    expect(post.featuredImageCaption).toBe('AI illustration, not evidence.');
    expect(post.socialImage).toBe('/images/blog/fixture.jpg');
    expect(post.content).not.toContain('AI illustration');
    expect(toColumnListItems([post])[0].featuredImageAlt).toBe('Road illustration');
    expect(toColumnListItems([post])[0]).not.toHaveProperty('featuredImageCaption');
    const metadata = buildSeoMetadata({ locale: 'en', title: post.title, description: post.summary, images: { url: post.socialImage!, alt: post.featuredImageAlt } });
    const image = { url: 'https://tseng-law.com/images/blog/fixture.jpg', alt: 'Road illustration' };
    expect(metadata.openGraph?.images).toEqual([image]);
    expect(metadata.twitter?.images).toEqual([image]);
  });

  it('preserves legacy image output and rejects non-string descriptions', () => {
    const post = loadImageFixture('featured_image_alt: 42\nfeatured_image_caption: null\nsocial_image: []');
    expect(post).not.toHaveProperty('featuredImageAlt');
    expect(post).not.toHaveProperty('featuredImageCaption');
    expect(post).not.toHaveProperty('socialImage');
    expect(toColumnListItems([post])[0]).not.toHaveProperty('featuredImageAlt');
    const metadata = buildSeoMetadata({ locale: 'en', title: post.title, description: post.summary, images: post.featuredImage });
    expect(metadata.twitter?.images).toEqual(['https://tseng-law.com/images/blog/fixture.webp']);
  });
});
