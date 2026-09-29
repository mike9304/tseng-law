import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const FAMILY = [
  '019-taiwanese-spouse-divorce-agreement-registration',
  '020-taiwanese-spouse-divorce-from-abroad',
  '021-taiwanese-spouse-divorce-cross-border-parenting',
  '022-marrying-taiwanese-national-registration-checklist',
  '023-baby-taiwan-nationality-birth-registration',
];
const LOCALES = ['ko', 'zh-hant', 'en', 'ja', 'zh-hans', 'vi', 'id', 'th', 'fil'] as const;

describe('family column hero images', () => {
  it('every family column has its own optimized webp hero (no shared wedding-ring photo)', () => {
    const images = new Set<string>();
    for (const id of FAMILY) {
      const file = path.join(process.cwd(), 'public/images/blog', id, 'featured-01.webp');
      expect(existsSync(file), file).toBe(true);
      expect(statSync(file).size).toBeLessThan(200_000);
      images.add(id);
    }
    expect(images.size).toBe(FAMILY.length);
  });

  for (const locale of LOCALES) {
    it(`${locale}: uses the per-topic hero and keeps the localized title as alt source`, () => {
      const seen = new Set<string>();
      for (const id of FAMILY) {
        const slug = id.replace(/^\d+-/, '');
        const post = getColumnPost(slug, locale);
        expect(post, `${locale}/${slug}`).toBeDefined();
        expect(post?.featuredImage).toBe(`/images/blog/${id}/featured-01.webp`);
        expect(post?.featuredImage).not.toContain('007-taiwan-divorce-lawsuit-qna');
        expect(post?.title.trim()).toBeTruthy();
        seen.add(post!.featuredImage);
      }
      expect(seen.size).toBe(FAMILY.length);
    });
  }
});
