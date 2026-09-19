import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { readColumnBundle } from '@/lib/builder/columns/storage';
import { listSemiconductorArticleDrafts } from '@/lib/semiconductor-drafts';
import { importSemiconductorColumnDrafts } from '@/lib/semiconductor-drafts-import';

describe('semiconductor CMS draft import', () => {
  const previousDir = process.env.CONSULTATION_COLUMNS_DIR;
  let tempDir = '';

  afterEach(() => {
    if (previousDir === undefined) {
      delete process.env.CONSULTATION_COLUMNS_DIR;
    } else {
      process.env.CONSULTATION_COLUMNS_DIR = previousDir;
    }
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('registers the still-unpublished Korean articles as drafts and leaves published ones alone', async () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'semi-draft-import-'));
    process.env.CONSULTATION_COLUMNS_DIR = tempDir;

    const first = await importSemiconductorColumnDrafts();
    const second = await importSemiconductorColumnDrafts();

    // 2026-09-19 owner decision: column 018 (taiwan-semiconductor-market-entry)
    // stays published, so its staging draft is skipped rather than re-imported.
    expect(first.skippedPublished.map((item) => item.slug)).toEqual([
      'taiwan-semiconductor-market-entry',
    ]);
    expect(first.imported).toHaveLength(listSemiconductorArticleDrafts().length - 1);
    expect(second.imported.every((item) => item.duplicate)).toBe(true);
    expect(second.skippedPublished).toEqual(first.skippedPublished);
    expect(fs.existsSync(path.join(tempDir, 'ko'))).toBe(true);

    const publishedSlugs = new Set(first.skippedPublished.map((item) => item.slug));
    for (const item of listSemiconductorArticleDrafts()) {
      if (publishedSlugs.has(item.slug)) {
        continue;
      }
      const bundle = await readColumnBundle('ko', item.slug);
      expect(bundle.published).toBeNull();
      expect(bundle.draft?.draft).toBe(true);
      expect(bundle.draft?.bodyMarkdown).toBe(item.bodyMarkdown);
      expect(bundle.draft?.frontmatter.author).toBeUndefined();
      expect(bundle.draft?.frontmatter.publishedAt).toBeUndefined();
      expect(bundle.draft?.frontmatter.attorneyReviewStatus).toBe('pending');
      expect(bundle.draft?.frontmatter.seo?.noIndex).toBe(true);
      expect(bundle.draft?.bodyMarkdown).toContain('https://law.moj.gov.tw');
    }
  });
});
