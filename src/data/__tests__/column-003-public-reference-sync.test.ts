import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

import { siteContent } from '@/data/site-content';

const slug = 'taiwan-traffic-accident-procedure';
const canonicalArticlePath = 'src/content/columns-en/003-taiwan-traffic-accident-procedure.md';
const canonicalZhHantArticlePath = 'src/content/columns-zh/003-taiwan-traffic-accident-procedure.md';

describe('column 003 public reference synchronization', () => {
  it('uses the canonical English frontmatter title for the civil related column', () => {
    const raw = fs.readFileSync(path.join(process.cwd(), canonicalArticlePath), 'utf8');
    const canonicalTitle = matter(raw).data.title;
    const relatedColumn = siteContent.en.services.items
      .flatMap((item) => item.relatedColumns ?? [])
      .find((column) => column.slug === slug);

    expect(relatedColumn).toEqual({ slug, title: canonicalTitle });
  });

  it('uses the canonical Traditional Chinese frontmatter title for the civil related column', () => {
    const raw = fs.readFileSync(path.join(process.cwd(), canonicalZhHantArticlePath), 'utf8');
    const canonicalTitle = matter(raw).data.title;
    const relatedColumn = siteContent['zh-hant'].services.items
      .flatMap((item) => item.relatedColumns ?? [])
      .find((column) => column.slug === slug);

    expect(relatedColumn).toEqual({ slug, title: canonicalTitle });
  });
});
