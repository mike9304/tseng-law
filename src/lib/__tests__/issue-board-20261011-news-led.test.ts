import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import {
  ISSUE_BOARD_LOCALES,
  ISSUE_CONTENT_ROOT,
  getAllColumnPosts,
  getAllIssuePosts,
  getIssuePost,
  issueIdFromFilename,
  issueSlugFromFilename,
} from '@/lib/columns';
import { PUBLIC_LOCALES_8 } from '@/lib/public-guidance';
import { isAiAuthoredColumn } from '@/lib/ai-authored-columns';
import { isColumnTopic } from '@/lib/column-topics';

// This batch owns only IDs 13–16. Other 2026-10-11 issues belong to another batch.
const CASES = [
  { locale: 'ja', id: 'ISSUE-20261011-13', slug: 'taiwan-biotech-mou-binding-terms-japanese' },
  { locale: 'ko', id: 'ISSUE-20261011-14', slug: 'taiwan-korean-electrical-steel-antidumping-reimbursement' },
  { locale: 'en', id: 'ISSUE-20261011-15', slug: 'taiwan-offshore-wind-supervised-payment-subcontractor' },
  { locale: 'vi', id: 'ISSUE-20261011-16', slug: 'taiwan-vietnam-marriage-leave-effective-date' },
] as const;

const allIssueFiles = ISSUE_BOARD_LOCALES.flatMap((locale) => {
  const dir = path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale);
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => file.endsWith('.md')).map((file) => ({ locale, file }))
    : [];
});

describe('four news-led issues approved on 2026-10-11', () => {
  it.each(CASES)('$id exists once in its approved locale', ({ locale, id, slug }) => {
    const matches = allIssueFiles.filter(({ file }) => issueIdFromFilename(file) === id);
    expect(matches).toEqual([{ locale, file: `${id}-${slug}.md` }]);
    expect(issueSlugFromFilename(matches[0].file)).toBe(slug);
    expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it.each(CASES)('$locale/$slug retains publication metadata, provenance and usable media', ({ locale, id, slug }) => {
    const raw = fs.readFileSync(path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale, `${id}-${slug}.md`), 'utf8');
    const { data, content } = matter(raw);
    expect(data.published).toBe('2026-10-12');
    expect(data.lastmod).toBe('2026-10-12');
    expect(data.audience).toEqual([locale]);
    expect(data.author).toBe('legal-ai-assistant');
    expect(isColumnTopic(data.topic)).toBe(true);
    expect(typeof data.title === 'string' && data.title.trim().length > 0).toBe(true);
    expect(typeof data.summary === 'string' && data.summary.trim().length > 0).toBe(true);
    expect(Array.isArray(data.faq) && data.faq.length > 0).toBe(true);
    expect(content).toMatch(/AI/); // The existing issue template renders this body disclosure.
    expect(raw).not.toMatch(/\*\*|__[^\n]+__|<strong\b|<b(?:\s|>)/i);
    expect(data.featured_image).toBe(`../images/${id}-${slug}/featured-01.webp`);

    const assetDir = path.join(process.cwd(), 'public/images/blog', `${id}-${slug}`);
    const webp = fs.readFileSync(path.join(assetDir, 'featured-01.webp'));
    const jpeg = fs.readFileSync(path.join(assetDir, 'featured-01.jpg'));
    expect(webp.subarray(0, 4).toString()).toBe('RIFF');
    expect(webp.subarray(8, 12).toString()).toBe('WEBP');
    expect([...jpeg.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
    // JPEG is a stored companion. The current issue template uses WebP for OG.
  });

  it.each(CASES)('$locale/$slug is discoverable on the issue board only', ({ locale, id, slug }) => {
    const post = getIssuePost(slug, locale);
    expect(post).toBeDefined();
    expect(post?.publicationDate).toBe('2026-10-12');
    expect(post?.featuredImage).toBe(`/images/blog/${id}-${slug}/featured-01.webp`);
    expect(isAiAuthoredColumn(post)).toBe(true);
    expect(getAllIssuePosts(locale).filter((candidate) => candidate.slug === slug)).toHaveLength(1);
    for (const other of ISSUE_BOARD_LOCALES) {
      if (other !== locale) expect(getIssuePost(slug, other), `${other}/${slug}`).toBeUndefined();
    }
    for (const other of PUBLIC_LOCALES_8) {
      expect(getAllColumnPosts(other).some((candidate) => candidate.slug === slug), `${other}/${slug}`).toBe(false);
    }
  });
});
