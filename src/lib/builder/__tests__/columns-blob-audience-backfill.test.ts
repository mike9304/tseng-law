import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import { prioritizeRecommendedColumns } from '@/lib/column-audience';
import { archiveLeadPublicationDate, archiveLeadSlugsFor } from '@/lib/__tests__/native-locale-columns';
import { getColumnPost } from '@/lib/columns';

const fileCorpus = vi.hoisted(() => new Map<string, import('@/lib/columns').ColumnPost[]>());

vi.mock('@/lib/columns', async (importOriginal) => {
  const columns = await importOriginal<typeof import('@/lib/columns')>();
  return {
    ...columns,
    getAllColumnPosts: (...args: Parameters<typeof columns.getAllColumnPosts>) => {
      // Only snapshot the unchanged markdown corpus; runtime storage and custom directories stay live.
      if (args.length > 1) return columns.getAllColumnPosts(...args);
      const locale = args[0] ?? 'ko';
      let posts = fileCorpus.get(locale);
      if (!posts) {
        posts = columns.getAllColumnPosts(locale);
        fileCorpus.set(locale, posts);
      }
      return posts.slice();
    },
  };
});

describe('published column copies keep file-only recommendation metadata', () => {
  beforeEach(() => {
    fileCorpus.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([true, false])('backfills matching image descriptions and strips CMS body attribution (same=%s)', async (sameImage) => {
    const root = await mkdtemp(path.join(tmpdir(), 'tseng-column-image-'));
    const slug = 'taiwan-lane-change-side-rear-collision-liability';
    const file = getColumnPost(slug, 'zh-hant')!;
    expect(file.featuredImageAlt).toBeTruthy();
    try {
      const localeDir = path.join(root, 'zh-hant');
      await mkdir(localeDir, { recursive: true });
      await writeFile(path.join(localeDir, `${slug}.published.json`), JSON.stringify({
        version: 1, slug, locale: 'zh-hant', title: file.title,
        summary: 'Published copy',
        bodyMarkdown: sameImage ? 'Published body\n\n曾雋崴律師（Wei Tseng）' : '',
        bodyHtml: '<p>Published body</p><p>曾雋崴律師（Wei Tseng）</p>',
        linkedSlugs: {}, frontmatter: {
          category: 'legal', featuredImage: sameImage ? file.featuredImage : '/images/different-cms-image.webp',
          lastmod: '2026-10-02T00:00:00.000Z', dateDisplay: '2026年10月2日',
          readTime: '1分鐘', tags: [], author: { name: 'Legal AI Assistant' },
          attorneyReviewStatus: 'pending', freshness: 'fresh', blogCategory: 'general',
        },
        draft: false, revision: 1, updatedAt: '2026-10-02T00:00:00.000Z', updatedBy: 'image-backfill-test',
      }));
      vi.stubEnv('CONSULTATION_COLUMNS_DIR', root);
      vi.stubEnv('BUILDER_COLUMNS_BACKEND', 'local');
      vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
      vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '');
      vi.stubEnv('CONSULTATION_LOG_BACKEND', '');
      vi.stubEnv('NODE_ENV', 'development');
      const post = (await getAllColumnPostsIncludingBlob('zh-hant')).find(p => p.slug === slug)!;
      expect(post.content.trim()).toBe('Published body');
      if (sameImage) {
        expect(post.featuredImageAlt).toBe(file.featuredImageAlt);
        expect(post.featuredImageCaption).toBe(file.featuredImageCaption);
        expect(post.socialImage).toBe(file.socialImage);
      } else {
        expect(post.featuredImageAlt).toBeUndefined();
        expect(post.featuredImageCaption).toBeUndefined();
        expect(post.socialImage).toBeUndefined();
      }
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('backfills audience, AI author and column number from the file copy', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'tseng-columns-'));
    try {
      const localeDir = path.join(root, 'ko');
      await mkdir(localeDir, { recursive: true });
      await writeFile(
        path.join(localeDir, 'taiwan-income-tax-residency.published.json'),
        JSON.stringify({
          version: 1,
          slug: 'taiwan-income-tax-residency',
          locale: 'ko',
          title: '**대만 세법상 거주자 판단**',
          summary: '**published copy** without audience',
          bodyMarkdown: '**본문** [출처](https://example.com)',
          bodyHtml: '<p>본문</p>',
          linkedSlugs: {},
          frontmatter: {
            lastmod: '2026-09-29T00:00:00.000Z',
            dateDisplay: '2026년 9월 29일',
            readTime: '8분 분량',
            attorneyReviewStatus: 'reviewed',
            freshness: 'fresh',
            category: 'legal',
            blogCategory: 'general',
            tags: [],
            author: { name: 'Legal AI Assistant' },
            featuredImage: '/images/placeholder-article-hero.jpg',
            publishedAt: '2026-09-29T00:00:00.000Z',
          },
          draft: false,
          revision: 1,
          updatedAt: '2026-09-29T00:00:00.000Z',
          updatedBy: 'audience-backfill-test',
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
      const shadowed = posts.find((post) => post.slug === 'taiwan-income-tax-residency');
      expect(shadowed?.summary).toBe('published copy without audience');
      expect(shadowed?.title).toBe('대만 세법상 거주자 판단');
      expect(shadowed?.content).toBe('본문 [출처](https://example.com)');
      expect(shadowed).toMatchObject({ audience: ['ko'], aiAuthored: true, columnNumber: 24 });
      // Newest publication date leads (archive lead order); same-day ties go to the higher column number.
      const lead = archiveLeadSlugsFor('ko');
      const newestDay = archiveLeadPublicationDate(lead[0]!);
      expect(prioritizeRecommendedColumns('ko', posts)[0]?.slug).toBe(
        lead.filter((slug) => archiveLeadPublicationDate(slug) === newestDay).at(-1),
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
