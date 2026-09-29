import { existsSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { getAllColumnPosts } from '@/lib/columns';
import {
  EN_RECOMMENDED_COLUMN_SLUGS,
  prioritizeEnRecommendedColumns,
  splitEnRecommendedColumns,
} from '@/lib/en-recommended-columns';
import {
  AI_AUTHORED_COLUMN_SLUGS,
  LEGAL_AI_ASSISTANT_AVATAR,
  buildAiAuthorJsonLd,
  getAiAuthorCopy,
  isAiAuthoredColumn,
} from '@/lib/ai-authored-columns';
import { buildArticleJsonLd } from '@/lib/seo';
import AiAuthorBox from '@/components/AiAuthorBox';

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: Record<string, unknown>) => <img {...(props as object)} />,
}));

describe('English recommended columns', () => {
  it('every recommended slug exists as an English column', () => {
    const slugs = new Set(getAllColumnPosts('en').map((post) => post.slug));
    for (const slug of EN_RECOMMENDED_COLUMN_SLUGS) expect(slugs.has(slug), slug).toBe(true);
  });

  it('puts the recommended columns first, in order, on English only', () => {
    const en = prioritizeEnRecommendedColumns('en', getAllColumnPosts('en'));
    expect(en.slice(0, EN_RECOMMENDED_COLUMN_SLUGS.length).map((post) => post.slug)).toEqual([...EN_RECOMMENDED_COLUMN_SLUGS]);
    expect(en).toHaveLength(getAllColumnPosts('en').length);
    const ko = getAllColumnPosts('ko');
    expect(prioritizeEnRecommendedColumns('ko', ko)).toEqual(ko);
    expect(splitEnRecommendedColumns('ja', getAllColumnPosts('ja')).recommended).toHaveLength(0);
  });
});

describe('AI-written columns', () => {
  it('covers 019–040 and not the attorney columns 001–018', () => {
    expect(AI_AUTHORED_COLUMN_SLUGS.size).toBe(22);
    expect(isAiAuthoredColumn('taiwan-semiconductor-market-entry')).toBe(false);
    expect(isAiAuthoredColumn('taiwan-divorce-lawsuit-qna')).toBe(false);
    expect(isAiAuthoredColumn('taiwan-exit-ban-foreigners')).toBe(true);
    for (const locale of ['ko', 'zh-hant', 'en', 'ja', 'zh-hans', 'vi', 'id', 'th', 'fil'] as const) {
      const slugs = new Set(getAllColumnPosts(locale).map((post) => post.slug));
      const ai = [...AI_AUTHORED_COLUMN_SLUGS].filter((slug) => slugs.has(slug));
      expect(ai.length, locale).toBeGreaterThan(0);
    }
  });

  it('has the avatar file and localized labels', () => {
    expect(existsSync(path.join(process.cwd(), 'public', LEGAL_AI_ASSISTANT_AVATAR))).toBe(true);
    expect(getAiAuthorCopy('ko').label).toBe('법률 AI 어시스턴트');
    expect(getAiAuthorCopy('en').label).toBe('Legal AI Assistant');
    expect(getAiAuthorCopy('ja').label).toBe('法律AIアシスタント');
    expect(getAiAuthorCopy('zh-hant').label).toBe('法律AI助理');
    expect(getAiAuthorCopy('xx').label).toBe('Legal AI Assistant');
  });

  it('author box renders avatar, label and note without attorney claims or a phone number', () => {
    for (const locale of ['ko', 'en', 'ja', 'zh-hant', 'vi']) {
      const html = renderToStaticMarkup(<AiAuthorBox locale={locale} />);
      expect(html).toContain('data-column-ai-author="true"');
      expect(html).toContain(LEGAL_AI_ASSISTANT_AVATAR);
      expect(html).toContain(getAiAuthorCopy(locale).label);
      expect(html).toContain(getAiAuthorCopy(locale).note);
      expect(html).not.toMatch(/증준외|曾雋崴|Wei Tseng|\d{2,4}-\d{3,4}-\d{4}/);
    }
  });

  it('article JSON-LD uses the AI author entity instead of the attorney', () => {
    const jsonLd = buildArticleJsonLd({
      locale: 'en',
      title: 't',
      description: 'd',
      path: '/en/columns/taiwan-exit-ban-foreigners',
      authorName: 'Legal AI Assistant',
      authorEntity: buildAiAuthorJsonLd('en'),
    });
    expect(jsonLd.author).toMatchObject({ '@type': 'Organization', name: 'Legal AI Assistant' });
    expect(JSON.stringify(jsonLd)).not.toMatch(/Wei Tseng|reviewedBy/);
  });
});
