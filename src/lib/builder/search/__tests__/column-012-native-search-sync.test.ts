import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Locale } from '@/lib/locales';
import { listBlogPosts } from '@/lib/builder/blog/column-adapter';
import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import { runSearchQuery } from '@/lib/builder/search/query-engine';
import { collectAllSearchDocs } from '@/lib/builder/search/source-collector';

const COLUMN_012_SLUG = 'taiwan-overtaking-accident-liability';
const COLUMN_007_SLUG = 'taiwan-divorce-lawsuit-qna';
const INDEXED_LOCALES = ['ko', 'zh-hant', 'en'] as const satisfies readonly Locale[];

const COLUMN_012_TITLES = {
  ko: '대만 추월 사고의 책임은 어떻게 판단하나요?',
  'zh-hant': '台灣超車事故的責任如何判斷？',
  en: 'How Is Liability Assessed After an Overtaking Accident in Taiwan?',
} as const;

const COLUMN_012_BODY_PHRASES = {
  ko: '도로교통안전규칙 제101조',
  'zh-hant': '道路交通安全規則》第101條',
  en: 'Article 101 of Taiwan',
} as const;

const COLUMN_007_TITLES = {
  ko: '대만 이혼 절차 Q&A: 조정·소송·재산분할·자녀',
  'zh-hant': '台灣離婚程序 Q&A：調解、訴訟、財產分配與子女',
  en: 'Taiwan Divorce Q&A: Mediation, Litigation, Property, and Children',
} as const;

const NATIVE_QUERIES = {
  ko: '대만 추월 사고',
  'zh-hant': '台灣 超車',
  en: 'Taiwan overtaking',
} as const;

const FAKE_NOW = '2026-07-25T22:00:00.000Z';
const FUTURE_PUBLISHED_AT = '2026-07-26T12:00:00.000Z';
const SCHEDULED_SLUG = 'col012-scheduled-future-native-search';

vi.mock('@/lib/builder/site/persistence', () => ({
  listPages: vi.fn(async () => []),
  readPageCanvas: vi.fn(async () => null),
}));

vi.mock('@/lib/builder/faq/faq-engine', () => ({
  listFaqSearchDocs: vi.fn(async () => []),
}));

vi.mock('@/lib/builder/portfolio/portfolio-engine', () => ({
  listPortfolioSearchDocs: vi.fn(async () => []),
}));

describe('column 012 native search source path', () => {
  let columnsRoot: string;
  const previousEnv = {
    BUILDER_COLUMNS_BACKEND: process.env.BUILDER_COLUMNS_BACKEND,
    CONSULTATION_COLUMNS_DIR: process.env.CONSULTATION_COLUMNS_DIR,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    BUILDER_USE_BLOB_IN_DEV: process.env.BUILDER_USE_BLOB_IN_DEV,
    CONSULTATION_LOG_BACKEND: process.env.CONSULTATION_LOG_BACKEND,
  };

  beforeEach(async () => {
    columnsRoot = await mkdtemp(path.join(tmpdir(), 'tseng-col012-native-search-'));
    process.env.BUILDER_COLUMNS_BACKEND = 'local';
    process.env.CONSULTATION_COLUMNS_DIR = columnsRoot;
    process.env.BLOB_READ_WRITE_TOKEN = '';
    process.env.BUILDER_USE_BLOB_IN_DEV = '';
    process.env.CONSULTATION_LOG_BACKEND = '';

    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(FAKE_NOW));
  });

  afterEach(async () => {
    vi.useRealTimers();

    for (const [key, value] of Object.entries(previousEnv)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }

    await rm(columnsRoot, { recursive: true, force: true });
  });

  it('includes real file-backed column 012 and keeps explicit future publishedAt scheduled', async () => {
    const localeDir = path.join(columnsRoot, 'ko');
    await mkdir(localeDir, { recursive: true });
    await writeFile(
      path.join(localeDir, `${SCHEDULED_SLUG}.published.json`),
      JSON.stringify({
        version: 1,
        slug: SCHEDULED_SLUG,
        locale: 'ko',
        title: 'Explicit future scheduled column',
        summary: 'Must remain excluded until publishedAt arrives',
        bodyMarkdown: 'Scheduled future column body for native search gate.',
        bodyHtml: '<p>Scheduled future column body for native search gate.</p>',
        linkedSlugs: {},
        frontmatter: {
          lastmod: '2026-07-20T00:00:00.000Z',
          dateDisplay: '2026년 7월 20일',
          readTime: '1분 분량',
          attorneyReviewStatus: 'reviewed',
          freshness: 'fresh',
          category: 'legal',
          blogCategory: 'general',
          tags: ['scheduled'],
          author: { name: '증준외 변호사', title: '대만 변호사' },
          featuredImage: '/images/placeholder-article-hero.jpg',
          featured: false,
          publishedAt: FUTURE_PUBLISHED_AT,
          seo: {
            title: 'Explicit future scheduled column',
            description: 'Must remain excluded until publishedAt arrives',
          },
        },
        draft: false,
        revision: 1,
        updatedAt: '2026-07-20T00:00:00.000Z',
        updatedBy: 'column-012-native-search-test',
      }),
      'utf8',
    );

    for (const locale of INDEXED_LOCALES) {
      const posts = await listBlogPosts(locale);
      const post012 = posts.find((post) => post.slug === COLUMN_012_SLUG);

      expect(post012, `listBlogPosts(${locale}) missing column 012`).toBeDefined();
      expect(post012?.publishedAt).toBe('2025-09-13T00:00:00.000Z');
      expect(post012?.title).toBe(COLUMN_012_TITLES[locale]);
    }

    const koPosts = await listBlogPosts('ko');
    expect(koPosts.find((post) => post.slug === SCHEDULED_SLUG)).toBeUndefined();

    const docs = await collectAllSearchDocs('default');

    for (const locale of INDEXED_LOCALES) {
      const doc012 = docs.find((doc) => doc.id === `blog:${locale}:${COLUMN_012_SLUG}`);
      expect(doc012, `collectAllSearchDocs missing column 012 for ${locale}`).toBeDefined();
      expect(doc012?.title).toBe(COLUMN_012_TITLES[locale]);
      expect(doc012?.url).toBe(`/${locale}/columns/${COLUMN_012_SLUG}`);
      expect(doc012?.body).toContain(COLUMN_012_BODY_PHRASES[locale]);

      const doc007 = docs.find((doc) => doc.id === `blog:${locale}:${COLUMN_007_SLUG}`);
      expect(doc007, `collectAllSearchDocs missing column 007 for ${locale}`).toBeDefined();
      expect(doc007?.title).toBe(COLUMN_007_TITLES[locale]);
      expect(doc007?.url).toBe(`/${locale}/columns/${COLUMN_007_SLUG}`);
    }

    expect(docs.find((doc) => doc.id === `blog:ko:${SCHEDULED_SLUG}`)).toBeUndefined();

    const index = buildSearchIndex(docs);

    for (const locale of INDEXED_LOCALES) {
      const hits = runSearchQuery({
        index,
        query: NATIVE_QUERIES[locale],
        locale,
      });
      const hit = hits.find((entry) => entry.doc.id === `blog:${locale}:${COLUMN_012_SLUG}`);

      expect(hit, `native query missed column 012 for ${locale}`).toBeDefined();
      expect(hit?.doc.title).toBe(COLUMN_012_TITLES[locale]);
      expect(hit?.doc.url).toBe(`/${locale}/columns/${COLUMN_012_SLUG}`);
    }
  });
});
