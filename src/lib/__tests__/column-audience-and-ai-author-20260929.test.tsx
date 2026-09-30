import { existsSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { getAllColumnPosts } from '@/lib/columns';
import {
  RECOMMENDED_SECTION_TITLE,
  normalizeColumnAudience,
  prioritizeRecommendedColumns,
  splitRecommendedColumns,
} from '@/lib/column-audience';
import {
  localeFromLanguageTag,
  localeHintFromReferrer,
  personalizeOrder,
  topicFromText,
} from '@/lib/reading-signals';
import RecommendedForYou from '@/components/RecommendedForYou';
import {
  AI_AUTHORED_COLUMN_SLUGS,
  LEGAL_AI_ASSISTANT_AVATAR,
  buildAiAuthorJsonLd,
  getAiAuthorCopy,
  isAiAuthoredColumn,
} from '@/lib/ai-authored-columns';
import { buildArticleJsonLd } from '@/lib/seo';
import AiAuthorBox from '@/components/AiAuthorBox';
import { expertiseSlugsFor } from './native-locale-columns';

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: Record<string, unknown>) => <img {...(props as object)} />,
}));

describe('audience frontmatter recommendations', () => {
  it('normalizes locale codes, country aliases and shared values', () => {
    expect(normalizeColumnAudience(['JP', 'us', 'TW', 'all'])).toEqual(['ja', 'en', 'zh-hant', 'global']);
    expect(normalizeColumnAudience('vi')).toEqual(['vi']);
    expect(normalizeColumnAudience(undefined)).toEqual([]);
  });

  it('parses the audience field and AI author from the column files', () => {
    const ja = getAllColumnPosts('ja').find((post) => post.slug === 'taiwan-subsidiary-employee-dismissal');
    expect(ja?.audience).toEqual(['ja']);
    expect(ja?.aiAuthored).toBe(true);
    const attorney = getAllColumnPosts('ko').find((post) => post.slug === 'taiwan-divorce-lawsuit-qna');
    expect(attorney?.aiAuthored).toBeFalsy();
  });

  it('leads each locale with its own-audience columns newest first, then shared, from its own files only', () => {
    const first = (locale: NonNullable<Parameters<typeof getAllColumnPosts>[0]>) =>
      prioritizeRecommendedColumns(locale, getAllColumnPosts(locale))[0]?.slug;
    // 2026-09-30 expertise columns (041-048) lead where a locale has them: same-day ties go to the
    // higher column number, so the last file of the batch comes first.
    expect(first('en')).toBe(expertiseSlugsFor('en').at(-1));
    expect(first('ja')).toBe(expertiseSlugsFor('ja').at(-1));
    expect(first('ko')).toBe(expertiseSlugsFor('ko').at(-1));
    expect(first('th')).toBe('baby-taiwan-nationality-birth-registration');
    for (const locale of ['ko', 'zh-hant', 'en', 'ja', 'vi', 'zh-hans', 'id', 'th', 'fil'] as const) {
      const posts = getAllColumnPosts(locale);
      const { recommended, rest } = splitRecommendedColumns(locale, posts);
      expect(recommended.length, locale).toBeGreaterThan(0);
      expect(recommended.length + rest.length, locale).toBe(posts.length);
      const own = new Set(posts.map((post) => post.slug));
      for (const post of recommended) expect(own.has(post.slug), `${locale}/${post.slug}`).toBe(true);
      const dates = recommended.map((post) => post.publicationDate || post.date);
      expect([...dates].sort().reverse(), locale).toEqual(dates);
      expect(RECOMMENDED_SECTION_TITLE[locale], locale).toBeTruthy();
    }
  });

  it('breaks same-day ties by column number regardless of input order', () => {
    const ko = getAllColumnPosts('ko');
    expect(prioritizeRecommendedColumns('ko', [...ko].reverse())[0]?.slug).toBe(expertiseSlugsFor('ko').at(-1));
    expect(prioritizeRecommendedColumns('zh-hant', [...getAllColumnPosts('zh-hant')].reverse())[0]?.slug)
      .toBe(expertiseSlugsFor('zh-hant').at(-1));
  });

  it('puts own-audience columns before shared ones, each newest first', () => {
    const posts = [
      { slug: 'shared-new', date: '2026-09-30', audience: ['global'] },
      { slug: 'ja-old', date: '2026-09-01', audience: ['ja'] },
      { slug: 'other', date: '2026-09-30', audience: ['ko'] },
      { slug: 'ja-new', date: '2026-09-29', audience: ['ja'] },
      { slug: 'shared-old', date: '2026-08-01', audience: ['global'] },
      { slug: 'untagged', date: '2026-09-30' },
    ];
    const { recommended, rest } = splitRecommendedColumns('ja', posts);
    expect(recommended.map((post) => post.slug)).toEqual(['ja-new', 'ja-old', 'shared-new', 'shared-old']);
    expect(rest.map((post) => post.slug)).toEqual(['other', 'untagged']);
  });
});

describe('client reading signals', () => {
  const items = [
    { slug: 'a', topic: 'company' },
    { slug: 'b', topic: 'family' },
    { slug: 'c', topic: 'visa' },
    { slug: 'd', topic: 'family' },
  ];

  it('keeps the static order without signals and moves the landing topic first', () => {
    expect(personalizeOrder(items, { topics: {}, viewed: [] }).map((i) => i.slug)).toEqual(['a', 'b', 'c', 'd']);
    expect(personalizeOrder(items, { topics: { family: 1 }, viewed: ['b'], landingTopic: 'family' }).map((i) => i.slug))
      .toEqual(['d', 'a', 'c', 'b']);
  });

  it('maps UTM text, referrers and browser languages', () => {
    expect(topicFromText('taiwan divorce custody')).toBe('family');
    expect(topicFromText('台湾 ビザ')).toBe('visa');
    expect(localeHintFromReferrer('search.yahoo.co.jp')).toBe('ja');
    expect(localeHintFromReferrer('www.google.com')).toBeUndefined();
    const known = ['ko', 'en', 'ja', 'zh-hant', 'zh-hans', 'vi', 'fil', 'id'];
    expect(localeFromLanguageTag('ja-JP', known)).toBe('ja');
    expect(localeFromLanguageTag('zh-TW', known)).toBe('zh-hant');
    expect(localeFromLanguageTag('zh-CN', known)).toBe('zh-hans');
    expect(localeFromLanguageTag('tl', known)).toBe('fil');
    expect(localeFromLanguageTag('xx', known)).toBeUndefined();
  });

  it('server-renders the static list as single stretched links (no personalization on the server)', () => {
    const html = renderToStaticMarkup(
      <RecommendedForYou
        locale="ko"
        hrefBase="/ko/columns"
        items={[
          { slug: 'one', title: 'One', featuredImage: '/x.webp', topic: 'family' },
          { slug: 'two', title: 'Two', featuredImage: '/y.webp', topic: 'visa' },
          { slug: 'three', title: 'Three', featuredImage: '/z.webp' },
          { slug: 'four', title: 'Four', featuredImage: '/w.webp' },
        ]}
      />,
    );
    expect(html).toContain('data-recommended-for-you="home"');
    expect(html).toContain('data-personalized="false"');
    expect(html).toContain('맞춤 추천 칼럼');
    expect(html.match(/<a /g)).toHaveLength(3);
    expect(html.match(/card-stretched-link/g)).toHaveLength(3);
    expect(html).not.toContain('/ko/columns/four');
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
