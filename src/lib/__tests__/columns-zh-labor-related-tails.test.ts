import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const relatedTail = `---

> 相關文章:
> - [台灣訴訟律師指南](/zh-hant/taiwan-litigation-lawyer)
> - [可用韓語溝通的台灣律師](/zh-hant/korean-lawyer-in-taiwan)
> - [服務項目 — 勞動法](/zh-hant/services/labor)`;

const targets = [
  {
    slug: 'taiwan-labor-severance-law',
    filename: '008-taiwan-labor-severance-law.md',
    finalBodyParagraph: '大家在台灣也要保護好自己的權益。',
    visibleHanCount: 1_566,
    readTime: '4分鐘閱讀',
  },
  {
    slug: 'taiwan-voluntary-resignation-severance',
    filename: '009-taiwan-voluntary-resignation-severance.md',
    finalBodyParagraph: '大多數情況下，事先做好準備的一方才能保障自己的權利。',
    visibleHanCount: 625,
    readTime: '2分鐘閱讀',
  },
];

describe('Traditional Chinese labor columns 008 and 009 — related tails', () => {
  for (const target of targets) {
    const columnPath = path.join(
      process.cwd(),
      'src/content/columns-zh',
      target.filename,
    );
    const raw = fs.readFileSync(columnPath, 'utf8');
    const parsed = matter(raw);
    const post = getColumnPost(target.slug, 'zh-hant');

    it(`restores the exact localized related tail for ${target.slug}`, () => {
      expect(parsed.content.trimEnd()).toBe(
        `${parsed.content.split('\n\n---\n\n')[0].trimEnd()}\n\n${relatedTail}`,
      );
      expect(
        parsed.content
          .trimEnd()
          .endsWith(`${target.finalBodyParagraph}\n\n${relatedTail}`),
      ).toBe(true);

      const internalLinks = Array.from(
        relatedTail.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g),
        (match) => match[1],
      );
      expect(internalLinks).toEqual([
        '/zh-hant/taiwan-litigation-lawyer',
        '/zh-hant/korean-lawyer-in-taiwan',
        '/zh-hant/services/labor',
      ]);
      expect(relatedTail).not.toMatch(/\/(?:ko|ja|en)\//);
    });

    it(`aligns ${target.slug} metadata with its final visible body`, () => {
      const visibleHanCount =
        parsed.content.match(/\p{Script=Han}/gu)?.length ?? 0;
      const calculatedMinutes = Math.ceil(visibleHanCount / 400);

      expect(parsed.data.lastmod).toBe('2026-07-27');
      expect(visibleHanCount).toBe(target.visibleHanCount);
      expect(parsed.data.read_time).toBe(target.readTime);
      expect(parsed.data.read_time).toBe(`${calculatedMinutes}分鐘閱讀`);
      expect(post).toMatchObject({
        slug: target.slug,
        date: '2026-07-27',
        readTime: target.readTime,
      });
    });
  }
});
