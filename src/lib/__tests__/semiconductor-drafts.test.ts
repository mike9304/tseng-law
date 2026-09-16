import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '@/lib/columns';
import { getServiceArea } from '@/data/service-details';
import {
  SEMICONDUCTOR_DRAFT_CATEGORY_ID,
  getSemiconductorDraftBySlug,
  getSemiconductorServiceDraft,
  listSemiconductorArticleDrafts,
  listSemiconductorDrafts,
  semiconductorDraftBodyWithoutLeadingTitle,
} from '@/lib/semiconductor-drafts';

const packageDir = path.join(
  process.env.HOME ?? '',
  'Downloads/tseng-law-semiconductor-2026-09-16',
);

describe('semiconductor unpublished drafts', () => {
  it('keeps the four Korean manuscripts byte-identical to the package', () => {
    const drafts = listSemiconductorDrafts();
    expect(drafts.map((item) => item.id)).toEqual([
      'semi-service-ko',
      'semi-ko-001',
      'semi-ko-002',
      'semi-ko-003',
    ]);

    for (const draft of drafts) {
      const packageFile = path.join(packageDir, 'content', path.basename(draft.sourceFile));
      const registered = fs.readFileSync(path.join(process.cwd(), draft.sourceFile));
      const original = fs.readFileSync(packageFile);
      expect(registered.equals(original)).toBe(true);
      expect(draft.sha256File).toBe(createHash('sha256').update(original).digest('hex'));
      expect(draft.author).toBeNull();
      expect(draft.legalReviewer).toBeNull();
      expect(draft.legalReviewedAt).toBeNull();
      expect(draft.publishedAt).toBeNull();
      expect(draft.publish).toBe(false);
      expect(draft.reviewStatus).toBe('NEEDS_LAWYER_REVIEW');
    }
  });

  it('preserves article bodies, tables, FAQs, footnotes and source links', () => {
    const expected = {
      'semi-ko-001': { chars: 8781, footnotes: 9 },
      'semi-ko-002': { chars: 10709, footnotes: 17 },
      'semi-ko-003': { chars: 11280, footnotes: 16 },
    } as const;

    for (const article of listSemiconductorArticleDrafts()) {
      const stats = expected[article.id as keyof typeof expected];
      expect(article.bodyCharacters).toBe(stats.chars);
      expect(article.categoryId).toBe(SEMICONDUCTOR_DRAFT_CATEGORY_ID);
      expect(article.topicId).toBeTruthy();
      expect(article.bodyMarkdown.startsWith('# ')).toBe(true);
      expect(article.bodyMarkdown).toContain('|');
      expect(article.bodyMarkdown).toMatch(/^\[\^[^\]]+\]:/m);
      expect(article.bodyMarkdown.match(/^\[\^[^\]]+\]:/gm)).toHaveLength(stats.footnotes);
      expect(article.bodyMarkdown).toContain('https://law.moj.gov.tw');
      expect(article.bodyMarkdown).toContain('2026년 9월 16일');
      expect(article.bodyMarkdown).toContain('2026년 9월 4일');
      expect(semiconductorDraftBodyWithoutLeadingTitle(article).startsWith('# ')).toBe(false);
    }

    const service = getSemiconductorServiceDraft();
    expect(service.bodyCharacters).toBe(995);
    expect(service.slug).toBe('semiconductor-companies');
  });

  it('does not leak drafts into public columns, services, or lookup helpers', () => {
    const publicSlugs = getAllColumnPosts('ko').map((post) => post.slug);
    for (const article of listSemiconductorArticleDrafts()) {
      expect(publicSlugs).not.toContain(article.slug);
      expect(getColumnPost(article.slug, 'ko')).toBeUndefined();
      expect(getColumnPost(article.slug, 'en')).toBeUndefined();
      expect(getColumnPost(article.slug, 'ja')).toBeUndefined();
    }
    expect(getServiceArea('semiconductor-companies')).toBeUndefined();
    expect(getSemiconductorDraftBySlug('taiwan-semiconductor-market-entry')?.publish).toBe(false);
  });
});
