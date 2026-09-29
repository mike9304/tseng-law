import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import { prioritizeRecommendedColumns } from '@/lib/column-audience';

describe('published column copies keep file-only recommendation metadata', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
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
          title: '대만 세법상 거주자 판단',
          summary: 'published copy without audience',
          bodyMarkdown: '본문',
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
      expect(shadowed).toMatchObject({ audience: ['ko'], aiAuthored: true, columnNumber: 24 });
      expect(prioritizeRecommendedColumns('ko', posts)[0]?.slug).toBe('hire-taiwan-lawyer-from-abroad');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
