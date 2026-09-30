import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { estimateColumnReadTimeLabel, getColumnsStorageBackend } from '@/lib/builder/columns/storage';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import {
  NATIVE_LOCALE_COLUMN_FILES,
  expertiseSlugsFor,
  isNativeLocaleColumnSlug,
} from '@/lib/__tests__/native-locale-columns';

describe('builder column storage backend', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses file storage in local development even when a Blob token is present', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'vercel_blob_rw_test');
    vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '');
    vi.stubEnv('BUILDER_COLUMNS_BACKEND', '');
    vi.stubEnv('CONSULTATION_LOG_BACKEND', '');
    vi.stubEnv('NODE_ENV', 'development');

    expect(getColumnsStorageBackend()).toBe('file');
    await expect(getAllColumnPostsIncludingBlob('ko')).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ slug: expect.any(String) }),
      ]),
    );
  });

  it('honors the column-local backend override when Blob is explicitly enabled', () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'vercel_blob_rw_test');
    vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '1');
    vi.stubEnv('BUILDER_COLUMNS_BACKEND', 'local');
    vi.stubEnv('NODE_ENV', 'development');

    expect(getColumnsStorageBackend()).toBe('file');
  });

  it('merges locally published consultation columns into the public reader', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'tseng-columns-'));

    try {
      const localeDir = path.join(root, 'ko');
      await mkdir(localeDir, { recursive: true });
      await writeFile(
        path.join(localeDir, 'local-runtime-column.published.json'),
        JSON.stringify({
          version: 1,
          slug: 'local-runtime-column',
          locale: 'ko',
          title: '로컬 런타임 칼럼',
          summary: 'runtime-data consultation-columns에서 온 칼럼',
          bodyMarkdown: '로컬 런타임 본문',
          bodyHtml: '<p>로컬 런타임 본문</p>',
          linkedSlugs: {},
          frontmatter: {
            lastmod: '2040-06-01T00:00:00.000Z',
            dateDisplay: '2040년 6월 1일',
            readTime: '7분 분량',
            attorneyReviewStatus: 'reviewed',
            freshness: 'fresh',
            category: 'case',
            blogCategory: 'general',
            tags: ['로컬'],
            author: { name: '증준외 변호사' },
            featuredImage: '/images/placeholder-article-hero.jpg',
            publishedAt: '2030-01-01T00:00:00.000Z',
          },
          draft: false,
          revision: 1,
          updatedAt: '2040-06-01T00:00:00.000Z',
          updatedBy: 'columns-backend-test',
        }),
        'utf8',
      );

      vi.stubEnv('CONSULTATION_COLUMNS_DIR', root);
      vi.stubEnv('BUILDER_COLUMNS_BACKEND', 'local');
      vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
      vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '');
      vi.stubEnv('CONSULTATION_LOG_BACKEND', '');
      vi.stubEnv('NODE_ENV', 'development');

      const posts = await getAllColumnPostsIncludingBlob('ko');

      expect(posts[0]).toMatchObject({
        slug: 'local-runtime-column',
        title: '로컬 런타임 칼럼',
        category: 'case',
        categoryLabel: '소송사례',
        featuredImage: '/images/placeholder-article-hero.jpg',
        publicationDate: '2030-01-01',
        date: '2040-06-01T00:00:00.000Z',
        dateDisplay: '2030년 1월 1일',
        readTime: '7분 분량',
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('preserves legacy KO 017 dateDisplay and readTime through the public merged reader', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'tseng-columns-'));

    try {
      vi.stubEnv('CONSULTATION_COLUMNS_DIR', root);
      vi.stubEnv('BUILDER_COLUMNS_BACKEND', 'local');
      vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
      vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '');
      vi.stubEnv('CONSULTATION_LOG_BACKEND', '');
      vi.stubEnv('NODE_ENV', 'development');

      const posts = await getAllColumnPostsIncludingBlob('ko');
      const post = posts.find((item) => item.slug === 'taiwan-logistics-business-setup');

      // The 2026-09-30 expertise columns (041-048) lead the ko archive.
      expect(posts[0]?.slug).toBe(expertiseSlugsFor('ko')[0]);
      expect(post?.dateDisplay).toBe('2025년 9월 13일');
      expect(post?.publicationDate).toBe('2025-09-13');
      expect(post?.readTime).toBe('9분 분량');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it.each(['ko', 'zh-hant', 'en'] as const)(
    'sorts the public %s runtime archive by publication date with stable source ties',
    async (locale) => {
      const root = await mkdtemp(path.join(tmpdir(), 'tseng-columns-'));

      try {
        vi.stubEnv('CONSULTATION_COLUMNS_DIR', root);
        vi.stubEnv('BUILDER_COLUMNS_BACKEND', 'local');
        vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
        vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '');
        vi.stubEnv('CONSULTATION_LOG_BACKEND', '');
        vi.stubEnv('NODE_ENV', 'development');

        const allPosts = await getAllColumnPostsIncludingBlob(locale);
        const nativeCount = locale === 'en' ? NATIVE_LOCALE_COLUMN_FILES.en.length : 0;
        const expertiseSlugs = expertiseSlugsFor(locale);
        const lead = expertiseSlugs.length;

        expect(allPosts).toHaveLength(31 + nativeCount + lead);
        // The 2026-09-30 expertise columns (041-048) lead the archive, in source order.
        expect(allPosts.slice(0, lead).map((post) => post.slug)).toEqual(expertiseSlugs);
        expect(allPosts.slice(0, lead).every((post) => post.publicationDate === '2026-09-30')).toBe(true);
        // English-only native columns (2026-09-29) follow the gap columns in source order.
        expect(
          allPosts.slice(lead + 8, lead + 8 + nativeCount).every((post) => isNativeLocaleColumnSlug(post.slug)),
        ).toBe(true);
        const posts = allPosts.filter(
          (post) => !isNativeLocaleColumnSlug(post.slug) && !expertiseSlugs.includes(post.slug),
        );
        // The 2026-09-29 gap columns (024-031) lead the archive, in source order.
        expect(posts.slice(0, 8).map((post) => post.slug)).toEqual([
          'taiwan-income-tax-residency',
          'taiwan-estate-tax-foreign-decedent',
          'foreign-heir-taiwan-succession-law-land',
          'taiwan-employment-gold-card',
          'taiwan-foreign-spouse-residence',
          'taiwan-permanent-residence-aprc',
          'enforce-foreign-judgment-in-taiwan',
          'hire-taiwan-lawyer-from-abroad',
        ]);
        expect(posts.slice(0, 8).every((post) => post.publicationDate === '2026-09-29')).toBe(true);
        expect(posts.slice(8, 11).map((post) => post.slug)).toEqual([
          'taiwanese-spouse-divorce-agreement-registration',
          'taiwanese-spouse-divorce-from-abroad',
          'taiwanese-spouse-divorce-cross-border-parenting',
        ]);
        // Re-dated to 2026-09-28 after the Fable review (user decision 2026-09-28).
        expect(posts.slice(8, 11).every((post) => post.publicationDate === '2026-09-28')).toBe(true);
        expect(posts[13]?.slug).toBe('taiwan-semiconductor-market-entry');
        expect(posts[13]?.publicationDate).toBe('2026-09-17');
        expect(posts[14]?.slug).toBe(
          'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
        );
        expect(posts[14]?.publicationDate).toBe('2026-02-04');
        expect(posts[15]?.slug).toBe('taiwan-company-establishment-basics');
        expect(posts.at(-1)?.slug).toBe('taiwan-logistics-business-setup');
        expect(posts.slice(15).every((post) => post.publicationDate === '2025-09-13')).toBe(true);
      } finally {
        await rm(root, { recursive: true, force: true });
      }
    },
  );

  it.each([
    {
      locale: 'ko' as const,
      body: '단어 '.repeat(181),
      expected: '2분 분량',
      expectedDate: '2030년 2월 3일',
    },
    {
      locale: 'zh-hant' as const,
      body: '字'.repeat(401),
      expected: '2分鐘閱讀',
      expectedDate: '2030年2月3日',
    },
    {
      locale: 'en' as const,
      body: 'word '.repeat(201),
      expected: '2 min read',
      expectedDate: 'February 3, 2030',
    },
  ])('uses a localized fallback for a $locale runtime document without metadata', async ({
    locale,
    body,
    expected,
    expectedDate,
  }) => {
    const root = await mkdtemp(path.join(tmpdir(), 'tseng-columns-'));

    try {
      const localeDir = path.join(root, locale);
      const slug = `${locale.replace('-', '')}-runtime-fallback`;
      await mkdir(localeDir, { recursive: true });
      await writeFile(
        path.join(localeDir, `${slug}.published.json`),
        JSON.stringify({
          version: 1,
          slug,
          locale,
          title: 'Runtime fallback column',
          summary: 'Fallback metadata test',
          bodyMarkdown: body,
          bodyHtml: '<p>Fallback metadata test</p>',
          linkedSlugs: {},
          frontmatter: {
            lastmod: '2030-02-03T00:00:00.000Z',
            attorneyReviewStatus: 'reviewed',
            freshness: 'fresh',
            category: 'legal',
            publishedAt: '2030-02-03T00:00:00.000Z',
          },
          draft: false,
          revision: 1,
          updatedAt: '2030-02-03T00:00:00.000Z',
          updatedBy: 'columns-backend-test',
        }),
        'utf8',
      );

      vi.stubEnv('CONSULTATION_COLUMNS_DIR', root);
      vi.stubEnv('BUILDER_COLUMNS_BACKEND', 'local');
      vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
      vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '');
      vi.stubEnv('CONSULTATION_LOG_BACKEND', '');
      vi.stubEnv('NODE_ENV', 'development');

      const posts = await getAllColumnPostsIncludingBlob(locale);
      const post = posts.find((item) => item.slug === slug);

      expect(post?.dateDisplay).toBe(expectedDate);
      expect(post?.publicationDate).toBe('2030-02-03');
      expect(post?.readTime).toBe(expected);
      expect(post?.readTime).not.toMatch(/^\d+ min$/);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('excludes Markdown syntax from fallback read-time estimates', () => {
    expect(estimateColumnReadTimeLabel('**' + '字'.repeat(400) + '**', 'zh-hant')).toBe('1分鐘閱讀');
    expect(estimateColumnReadTimeLabel('[word](https://example.com/path) '.repeat(200), 'en')).toBe('1 min read');
  });

  it('filters mirrored visual load-more test columns from the public reader', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'tseng-columns-'));

    try {
      const localeDir = path.join(root, 'ko');
      await mkdir(localeDir, { recursive: true });
      const documents = [
        {
          slug: 'visual-load-more-mps7blct-01',
          title: 'Visual Load More 1',
          summary: '테스트 정크 칼럼',
          updatedAt: '2031-01-01T00:00:00.000Z',
        },
        {
          slug: 'post-mrcv6h2k',
          title: 'G-Editor UI 칼럼 수정 mrcv6gic',
          summary: '중단된 UI 테스트가 남긴 공개 레코드',
          updatedAt: '2032-01-01T00:00:00.000Z',
        },
        {
          slug: 'local-real-column',
          title: '실제 로컬 칼럼',
          summary: '실제 칼럼 요약',
          updatedAt: '2030-01-01T00:00:00.000Z',
        },
      ];
      for (const document of documents) {
        await writeFile(
          path.join(localeDir, `${document.slug}.published.json`),
          JSON.stringify({
            version: 1,
            slug: document.slug,
            locale: 'ko',
            title: document.title,
            summary: document.summary,
            bodyMarkdown: document.summary,
            bodyHtml: `<p>${document.summary}</p>`,
            linkedSlugs: {},
            frontmatter: {
              lastmod: document.updatedAt,
              attorneyReviewStatus: 'reviewed',
              freshness: 'fresh',
              category: 'legal',
              blogCategory: 'general',
              tags: [],
              author: { name: '증준외 변호사' },
              featuredImage: '/images/placeholder-article-hero.jpg',
              publishedAt: document.updatedAt,
            },
            draft: false,
            revision: 1,
            updatedAt: document.updatedAt,
            updatedBy: 'columns-backend-test',
          }),
          'utf8',
        );
      }

      vi.stubEnv('CONSULTATION_COLUMNS_DIR', root);
      vi.stubEnv('BUILDER_COLUMNS_BACKEND', 'local');
      vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
      vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '');
      vi.stubEnv('CONSULTATION_LOG_BACKEND', '');
      vi.stubEnv('NODE_ENV', 'development');

      const posts = await getAllColumnPostsIncludingBlob('ko');

      expect(posts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            slug: 'local-real-column',
            title: '실제 로컬 칼럼',
          }),
        ]),
      );
      expect(posts.some((post) => post.slug.startsWith('visual-load-more'))).toBe(false);
      expect(posts.some((post) => post.title.startsWith('Visual Load More'))).toBe(false);
      expect(posts.some((post) => post.title.startsWith('G-Editor UI'))).toBe(false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
