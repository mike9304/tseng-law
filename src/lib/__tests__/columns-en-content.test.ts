import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '@/lib/columns';

const HANGUL = /[\uac00-\ud7af]/;
const root = process.cwd();
const koDir = path.join(root, 'src/content/columns');
const enDir = path.join(root, 'src/content/columns-en');

const koFiles = fs
  .readdirSync(koDir)
  .filter((name) => name.endsWith('.md'))
  .sort();

describe('English full column corpus', () => {
  it('has one EN file per KO file with identical filenames', () => {
    expect(fs.existsSync(enDir)).toBe(true);
    const enFiles = fs.readdirSync(enDir).filter((name) => name.endsWith('.md')).sort();
    expect(enFiles).toEqual(koFiles);
  });

  it('loads 17 English posts with full bodies (not Overview stubs only)', () => {
    const posts = getAllColumnPosts('en');
    expect(posts).toHaveLength(17);

    for (const post of posts) {
      expect(post.title.trim().length).toBeGreaterThan(8);
      expect(post.content.length).toBeGreaterThan(800);
      expect(post.content).not.toMatch(/^## Overview\n[\s\S]*## Key Focus Areas\n[\s\S]*## Consultation\nFor a case-specific/);
      expect(HANGUL.test(post.title)).toBe(false);
      expect(HANGUL.test(post.content)).toBe(false);
      expect(post.dateDisplay).not.toMatch(/Date pending/i);
      expect(post.date).toBeTruthy();
      if (post.faq?.length) {
        for (const item of post.faq) {
          expect(HANGUL.test(item.q)).toBe(false);
          expect(HANGUL.test(item.a)).toBe(false);
        }
      }
    }
  });

  it('preserves FAQ count for known FAQ sources', () => {
    const faqSlugs = [
      'taiwan-company-establishment-basics',
      'withdraw-capital-taiwan-company',
      'taiwan-company-subsidiary-vs-branch',
      'taiwan-labor-severance-law',
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    ];
    for (const slug of faqSlugs) {
      const ko = getColumnPost(slug, 'ko');
      const en = getColumnPost(slug, 'en');
      expect(en?.faq?.length ?? 0).toBe(ko?.faq?.length ?? 0);
      expect((en?.faq?.length ?? 0) > 0).toBe(true);
    }
  });

  it('EN body is not dramatically shorter than KO for each slug', () => {
    for (const file of koFiles) {
      const slug = file.replace(/\.md$/, '').replace(/^\d{3}-/, '');
      const ko = getColumnPost(slug, 'ko');
      const en = getColumnPost(slug, 'en');
      expect(ko).toBeTruthy();
      expect(en).toBeTruthy();
      // Allow EN to be shorter, but not stub-level (< 35% of KO cleaned body)
      expect(en!.content.length).toBeGreaterThan(Math.floor(ko!.content.length * 0.35));
    }
  });
});
